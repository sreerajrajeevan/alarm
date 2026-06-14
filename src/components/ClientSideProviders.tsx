
"use client"

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LocalNotifications } from '@capacitor/local-notifications';
import { FirebaseClientProvider } from '@/firebase';
import { AlarmMonitor } from '@/components/AlarmMonitor';

export function ClientSideProviders({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const perm = await LocalNotifications.requestPermissions();
        if (perm.display !== 'granted') {
          console.warn('Notification permissions not granted');
        }

        // Listener for when user clicks the notification
        LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
          const alarmId = action.notification.extra?.alarmId;
          if (alarmId) {
            router.push(`/ringing?id=${alarmId}`);
          }
        });
      } catch (e) {
        console.error('Notification setup failed', e);
      }
    };

    setupNotifications();
    
    return () => {
      LocalNotifications.removeAllListeners();
    };
  }, [router]);

  return (
    <FirebaseClientProvider>
      <AlarmMonitor />
      {children}
    </FirebaseClientProvider>
  );
}
