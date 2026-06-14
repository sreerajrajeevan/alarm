'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc,
  query,
  orderBy
} from 'firebase/firestore';
import { useFirestore, useCollection, useDoc } from '@/firebase';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Alarm {
  id: string;
  time: string; // HH:mm
  enabled: boolean;
  days: number[]; // 0-6
  label: string;
  difficulty: Difficulty;
  vibrate: boolean;
  rampUp: boolean;
}

export interface Stats {
  streaks: number;
  completedChallenges: number;
  averageWakeTime: string;
  history: { date: string; time: string; object: string }[];
}

// Hardcoded for single-user guest experience in Capacitor
const GUEST_UID = 'guest-user';

function stringToHash(s: string) {
  let hash = 0;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const syncNotifications = async (alarms: Alarm[]) => {
  if (!Capacitor.isNativePlatform()) return;

  try {
    const perm = await LocalNotifications.checkPermissions();
    if (perm.display !== 'granted') {
      await LocalNotifications.requestPermissions();
    }

    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel(pending);
    }

    const notifications: any[] = [];
    for (const alarm of alarms) {
      if (!alarm.enabled) continue;

      const [hours, minutes] = alarm.time.split(':').map(Number);

      if (alarm.days.length === 0) {
        let date = new Date();
        date.setHours(hours, minutes, 0, 0);
        if (date <= new Date()) date.setDate(date.getDate() + 1);

        notifications.push({
          title: 'AlarmQuest',
          body: alarm.label || 'Time to wake up!',
          id: stringToHash(alarm.id),
          schedule: { at: date, allowWhileIdle: true },
          extra: { alarmId: alarm.id }
        });
      } else {
        for (const day of alarm.days) {
          notifications.push({
            title: 'AlarmQuest',
            body: alarm.label || 'Time to wake up!',
            id: stringToHash(alarm.id + day),
            schedule: {
              on: {
                weekday: day + 1, // 1 is Sunday, 7 is Saturday
                hour: hours,
                minute: minutes
              },
              repeats: true,
              allowWhileIdle: true
            },
            extra: { alarmId: alarm.id }
          });
        }
      }
    }

    if (notifications.length > 0) {
      await LocalNotifications.schedule({ notifications });
    }
  } catch (error) {
    console.error('Error syncing notifications', error);
  }
};

export function useAlarms() {
  const db = useFirestore();

  const alarmsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'users', GUEST_UID, 'alarms'), orderBy('time', 'asc'));
  }, [db]);

  const { data: alarms, loading } = useCollection<Alarm>(alarmsQuery);

  useEffect(() => {
    if (alarms) {
      syncNotifications(alarms);
    }
  }, [alarms]);

  const addAlarm = (alarm: Omit<Alarm, 'id'>) => {
    if (!db) return;
    const newAlarmRef = doc(collection(db, 'users', GUEST_UID, 'alarms'));
    setDoc(newAlarmRef, { ...alarm, id: newAlarmRef.id });
  };

  const toggleAlarm = (id: string) => {
    if (!db) return;
    const alarm = alarms?.find(a => a.id === id);
    if (alarm) {
      updateDoc(doc(db, 'users', GUEST_UID, 'alarms', id), { enabled: !alarm.enabled });
    }
  };

  const deleteAlarm = (id: string) => {
    if (!db) return;
    deleteDoc(doc(db, 'users', GUEST_UID, 'alarms', id));
  };

  return { alarms: alarms || [], loading, addAlarm, toggleAlarm, deleteAlarm };
}

export function useStats() {
  const db = useFirestore();

  const statsRef = useMemo(() => {
    if (!db) return null;
    return doc(db, 'users', GUEST_UID, 'stats', 'current');
  }, [db]);

  const { data: statsData, loading } = useDoc<Stats>(statsRef);

  const stats = useMemo(() => statsData || {
    streaks: 0,
    completedChallenges: 0,
    averageWakeTime: '00:00',
    history: []
  }, [statsData]);

  const addCompletion = (object: string) => {
    if (!db || !statsRef) return;
    
    const now = new Date();
    const newEntry = {
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      object
    };

    const newHistory = [newEntry, ...(stats.history || [])].slice(0, 10);
    
    setDoc(statsRef, {
      ...stats,
      completedChallenges: (stats.completedChallenges || 0) + 1,
      streaks: (stats.streaks || 0) + 1,
      history: newHistory
    }, { merge: true });
  };

  const resetStats = () => {
    if (!statsRef) return;
    setDoc(statsRef, {
      streaks: 0,
      completedChallenges: 0,
      averageWakeTime: '00:00',
      history: []
    });
  };

  return { stats, loading, addCompletion, resetStats };
}

export function useSettings() {
  const [settings, setSettings] = useState({
    aiSensitivity: 0.8,
    vibrationEnabled: true,
    rampUpEnabled: true,
    theme: 'dark'
  });

  useEffect(() => {
    const stored = localStorage.getItem('alarmquest_settings');
    if (stored) setSettings(JSON.parse(stored));
  }, []);

  const updateSettings = (newSettings: any) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('alarmquest_settings', JSON.stringify(updated));
  };

  return { settings, updateSettings };
}
