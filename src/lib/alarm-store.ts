"use client"

import { useState, useEffect } from 'react';

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

export interface UserSettings {
  aiSensitivity: number;
  vibrationEnabled: boolean;
  rampUpEnabled: boolean;
  theme: 'dark' | 'light';
}

const DEFAULT_ALARMS: Alarm[] = [
  {
    id: '1',
    time: '07:30',
    enabled: true,
    days: [1, 2, 3, 4, 5],
    label: 'Morning Workout',
    difficulty: 'medium',
    vibrate: true,
    rampUp: true,
  },
  {
    id: '2',
    time: '08:45',
    enabled: false,
    days: [0, 6],
    label: 'Weekend Chill',
    difficulty: 'easy',
    vibrate: true,
    rampUp: false,
  }
];

export function useAlarms() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('alarmquest_alarms');
    if (stored) {
      setAlarms(JSON.parse(stored));
    } else {
      setAlarms(DEFAULT_ALARMS);
    }
    setLoading(false);
  }, []);

  const saveAlarms = (newAlarms: Alarm[]) => {
    setAlarms(newAlarms);
    localStorage.setItem('alarmquest_alarms', JSON.stringify(newAlarms));
  };

  const addAlarm = (alarm: Omit<Alarm, 'id'>) => {
    const newAlarm = { ...alarm, id: Math.random().toString(36).substr(2, 9) };
    saveAlarms([...alarms, newAlarm]);
  };

  const toggleAlarm = (id: string) => {
    saveAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const deleteAlarm = (id: string) => {
    saveAlarms(alarms.filter(a => a.id !== id));
  };

  return { alarms, loading, addAlarm, toggleAlarm, deleteAlarm };
}

export function useStats() {
  const [stats, setStats] = useState<Stats>({
    streaks: 12,
    completedChallenges: 48,
    averageWakeTime: '07:12',
    history: [
      { date: 'Oct 24', time: '07:05', object: 'Mug' },
      { date: 'Oct 23', time: '07:15', object: 'Keys' },
      { date: 'Oct 22', time: '07:00', object: 'Book' },
    ]
  });

  useEffect(() => {
    const stored = localStorage.getItem('alarmquest_stats');
    if (stored) setStats(JSON.parse(stored));
  }, []);

  const addCompletion = (object: string) => {
    const newStats = {
      ...stats,
      completedChallenges: stats.completedChallenges + 1,
      streaks: stats.streaks + 1,
      history: [{ date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }), object }, ...stats.history].slice(0, 10)
    };
    setStats(newStats);
    localStorage.setItem('alarmquest_stats', JSON.stringify(newStats));
  };

  const resetStats = () => {
    const fresh = {
      streaks: 0,
      completedChallenges: 0,
      averageWakeTime: '00:00',
      history: []
    };
    setStats(fresh);
    localStorage.setItem('alarmquest_stats', JSON.stringify(fresh));
  };

  return { stats, addCompletion, resetStats };
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>({
    aiSensitivity: 0.8,
    vibrationEnabled: true,
    rampUpEnabled: true,
    theme: 'dark'
  });

  useEffect(() => {
    const stored = localStorage.getItem('alarmquest_settings');
    if (stored) setSettings(JSON.parse(stored));
  }, []);

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('alarmquest_settings', JSON.stringify(updated));
  };

  return { settings, updateSettings };
}
