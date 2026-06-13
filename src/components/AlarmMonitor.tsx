
"use client"

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAlarms } from '@/lib/alarm-store';

export function AlarmMonitor() {
  const router = useRouter();
  const pathname = usePathname();
  const { alarms, markAsFired } = useAlarms();

  useEffect(() => {
    // Don't check if we're already on the ringing or challenge screens
    if (pathname.includes('/ringing') || pathname.includes('/challenge')) {
      return;
    }

    const checkAlarms = () => {
      const now = new Date();
      const currentHHmm = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });
      const currentDay = now.getDay();

      const dueAlarm = alarms.find(alarm => {
        if (!alarm.enabled) return false;
        
        // Match time and day
        const timeMatch = alarm.time === currentHHmm;
        const dayMatch = alarm.days.includes(currentDay);
        
        // Prevent re-firing if it already fired in the last 2 minutes
        let alreadyFired = false;
        if (alarm.lastFired) {
          const lastFiredDate = new Date(alarm.lastFired);
          const diffMinutes = (now.getTime() - lastFiredDate.getTime()) / 60000;
          if (diffMinutes < 2) alreadyFired = true;
        }

        return timeMatch && dayMatch && !alreadyFired;
      });

      if (dueAlarm) {
        markAsFired(dueAlarm.id);
        router.push(`/ringing?id=${dueAlarm.id}`);
      }
    };

    // Check every 10 seconds
    const interval = setInterval(checkAlarms, 10000);
    return () => clearInterval(interval);
  }, [alarms, pathname, router, markAsFired]);

  return null;
}
