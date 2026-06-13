
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
import { useFirestore, useCollection, useDoc, useUser } from '@/firebase';

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

export function useAlarms() {
  const { user } = useUser();
  const db = useFirestore();

  const alarmsQuery = useMemo(() => {
    if (!db || !user) return null;
    return query(collection(db, 'users', user.uid, 'alarms'), orderBy('time', 'asc'));
  }, [db, user]);

  const { data: alarms, loading } = useCollection<Alarm>(alarmsQuery);

  const addAlarm = (alarm: Omit<Alarm, 'id'>) => {
    if (!db || !user) return;
    const newAlarmRef = doc(collection(db, 'users', user.uid, 'alarms'));
    setDoc(newAlarmRef, { ...alarm, id: newAlarmRef.id });
  };

  const toggleAlarm = (id: string) => {
    if (!db || !user) return;
    const alarm = alarms?.find(a => a.id === id);
    if (alarm) {
      updateDoc(doc(db, 'users', user.uid, 'alarms', id), { enabled: !alarm.enabled });
    }
  };

  const deleteAlarm = (id: string) => {
    if (!db || !user) return;
    deleteDoc(doc(db, 'users', user.uid, 'alarms', id));
  };

  return { alarms: alarms || [], loading, addAlarm, toggleAlarm, deleteAlarm };
}

export function useStats() {
  const { user } = useUser();
  const db = useFirestore();

  const statsRef = useMemo(() => {
    if (!db || !user) return null;
    return doc(db, 'users', user.uid, 'stats', 'current');
  }, [db, user]);

  const { data: statsData, loading } = useDoc<Stats>(statsRef);

  const stats = useMemo(() => statsData || {
    streaks: 0,
    completedChallenges: 0,
    averageWakeTime: '00:00',
    history: []
  }, [statsData]);

  const addCompletion = (object: string) => {
    if (!db || !user || !statsRef) return;
    
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
