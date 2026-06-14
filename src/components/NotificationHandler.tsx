"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';

export function NotificationHandler() {
  const router = useRouter();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const setupListeners = async () => {
      await LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        const alarmId = notification.notification.extra?.alarmId;
        if (alarmId) {
          router.push(`/ringing?id=${alarmId}`);
        }
      });
    };

    setupListeners();

    return () => {
      LocalNotifications.removeAllListeners();
    };
  }, [router]);

  return null;
}
