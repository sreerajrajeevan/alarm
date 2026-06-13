
"use client"

import type {Viewport} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { AlarmMonitor } from '@/components/AlarmMonitor';
import { Toaster } from '@/components/ui/toaster';
import { useEffect } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { useRouter } from 'next/navigation';

export const viewport: Viewport = {
  themeColor: '#161A1E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-body antialiased min-h-screen dot-pattern selection:bg-primary/30">
        <FirebaseClientProvider>
          <AlarmMonitor />
          {children}
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
