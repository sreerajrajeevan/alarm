
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
  lastFired?: string; // ISO date string to prevent double firing
}

export interface Stats {
  streaks: number;
  completedChallenges: number;
  averageWakeTime: string;
  history: { date: string; time: string; object: string }[];
}

const GUEST_UID = 'guest-user';

// Helper to convert string ID to numeric for Capacitor
const getNumericId = (id: string, dayOffset: number = 0) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) + dayOffset;
};

export function useAlarms() {
  const db = useFirestore();

  const alarmsQuery = useMemo(() => {
    if (!db) return null;
    return query(collection(db, 'users', GUEST_UID, 'alarms'), orderBy('time', 'asc'));
  }, [db]);

  const { data: alarms, loading } = useCollection<Alarm>(alarmsQuery);

  // Sync native notifications whenever alarms change
  useEffect(() => {
    if (!alarms || alarms.length === 0) return;

    const syncNativeAlarms = async () => {
      try {
        const pending = await LocalNotifications.getPending();
        if (pending.notifications.length > 0) {
          await LocalNotifications.cancel(pending);
        }

        for (const alarm of alarms) {
          if (!alarm.enabled) continue;

          const [hour, minute] = alarm.time.split(':').map(Number);
          
          // Schedule for each selected day
          for (const day of alarm.days) {
            await LocalNotifications.schedule({
              notifications: [
                {
                  title: 'AlarmQuest Ringing!',
                  body: alarm.label || 'Time to complete your quest and wake up.',
                  id: getNumericId(alarm.id, day),
                  schedule: {
                    on: {
                      weekday: (day === 0 ? 7 : day) + 1, // Sunday is 1 in Capacitor, our state is 0
                      hour,
                      minute
                    },
                    allowWhileIdle: true,
                    repeats: true
                  },
                  extra: { alarmId: alarm.id },
                  smallIcon: 'ic_stat_alarm',
                  actionTypeId: 'OPEN_QUEST'
                }
              ]
            });
          }
        }
      } catch (e) {
        console.error('Failed to sync native notifications', e);
      }
    };

    syncNativeAlarms();
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

  const markAsFired = (id: string) => {
    if (!db) return;
    updateDoc(doc(db, 'users', GUEST_UID, 'alarms', id), { 
      lastFired: new Date().toISOString() 
    });
  };

  return { alarms: alarms || [], loading, addAlarm, toggleAlarm, deleteAlarm, markAsFired };
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
