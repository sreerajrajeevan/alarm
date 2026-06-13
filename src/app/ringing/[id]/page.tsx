"use client"

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DotMatrixText } from '@/components/DotMatrixText';
import { Button } from '@/components/ui/button';
import { Camera, RefreshCw } from 'lucide-react';
import { useAlarms } from '@/lib/alarm-store';

const OBJECT_OPTIONS = [
  'Toothbrush', 'Shoes', 'Water Bottle', 'Pillow', 'Chair', 'Remote Control', 
  'Mug', 'Keys', 'Book', 'Laptop', 'Wallet', 'Towel', 'Pen', 'Spectacles'
];

export default function RingingScreen() {
  const router = useRouter();
  const { id } = useParams();
  const { alarms } = useAlarms();
  
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [targetObject, setTargetObject] = useState<string>('');
  
  const alarm = alarms.find(a => a.id === id);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    setTargetObject(OBJECT_OPTIONS[Math.floor(Math.random() * OBJECT_OPTIONS.length)]);
    
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted || !currentTime) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <DotMatrixText className="text-xs text-muted-foreground">Initializing Quest...</DotMatrixText>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-between p-8 overflow-hidden">
      {/* Background Pulsing Dots */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-10">
        <div className="w-[120%] h-[120%] animate-pulse-dot grid grid-cols-12 grid-rows-12">
          {Array(144).fill(0).map((_, i) => (
            <div key={i} className="flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full" />
            </div>
          ))}
        </div>
      </div>

      <div className="z-10 text-center mt-12 w-full">
        <DotMatrixText className="text-xl text-muted-foreground/60 tracking-[0.3em] mb-4">WAKE UP</DotMatrixText>
        <div className="text-8xl font-headline font-bold tracking-tighter text-foreground mb-2 drop-shadow-2xl">
          {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
        </div>
        <p className="text-primary font-medium tracking-wide animate-pulse">
          {alarm?.label || 'Alarmquest'}
        </p>
      </div>

      <div className="z-10 w-full flex flex-col items-center gap-6">
        <div className="glass-card p-8 rounded-3xl border-primary/20 bg-primary/5 w-full max-w-sm text-center">
          <DotMatrixText className="text-sm text-muted-foreground tracking-widest mb-4">QUEST ASSIGNED</DotMatrixText>
          <div className="text-2xl font-bold mb-2 text-white/90">Capture a picture of:</div>
          <div className="text-4xl font-headline text-primary font-bold uppercase tracking-tight mb-4 drop-shadow-[0_0_15px_rgba(64,191,191,0.3)]">
            {targetObject}
          </div>
          <p className="text-xs text-muted-foreground/60 leading-relaxed px-4">
            The alarm will continue to ring until this object is successfully identified by AI.
          </p>
        </div>

        <div className="flex gap-4 w-full max-w-sm">
          <Button 
            variant="ghost" 
            className="flex-1 h-16 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-5 h-5 mr-2 opacity-50" />
            Snooze
          </Button>
          <Button 
            className="flex-[2] h-16 rounded-2xl bg-primary text-background hover:bg-primary/90 font-headline text-lg nothing-glow"
            onClick={() => router.push(`/challenge/${id}?target=${targetObject}`)}
          >
            <Camera className="w-6 h-6 mr-2" />
            Open Camera
          </Button>
        </div>
      </div>

      <div className="z-10 mb-8 opacity-40">
        <DotMatrixText className="text-[10px] tracking-[0.5em]">ALARMQUEST v1.0.0</DotMatrixText>
      </div>
    </div>
  );
}
