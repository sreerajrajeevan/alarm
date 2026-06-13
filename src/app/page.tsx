"use client"

import React from 'react';
import Link from 'next/link';
import { Plus, BarChart3, Settings, Clock, CheckCircle2, Flame, Bell, Trash2 } from 'lucide-react';
import { DotMatrixText } from '@/components/DotMatrixText';
import { NothingCard } from '@/components/NothingCard';
import { useAlarms, useStats } from '@/lib/alarm-store';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Dashboard() {
  const { alarms, loading, toggleAlarm, deleteAlarm } = useAlarms();
  const { stats } = useStats();

  return (
    <div className="max-w-md mx-auto min-h-screen p-6 flex flex-col gap-8 pb-24">
      <header className="flex justify-between items-center mt-4">
        <div>
          <DotMatrixText as="h1" className="text-3xl font-bold tracking-tighter">AlarmQuest</DotMatrixText>
          <p className="text-muted-foreground text-sm font-medium opacity-60">Nothing UI Edition</p>
        </div>
        <div className="flex gap-2">
          <Link href="/stats">
            <Button variant="ghost" size="icon" className="rounded-full bg-white/5">
              <BarChart3 className="w-5 h-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="rounded-full bg-white/5">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-4">
        <NothingCard className="flex flex-col gap-1 items-center justify-center py-4 bg-primary/5 border-primary/20">
          <Flame className="w-6 h-6 text-primary mb-1" />
          <span className="text-2xl font-headline font-bold">{stats.streaks}</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Day Streak</span>
        </NothingCard>
        <NothingCard className="flex flex-col gap-1 items-center justify-center py-4">
          <CheckCircle2 className="w-6 h-6 text-muted-foreground/60 mb-1" />
          <span className="text-2xl font-headline font-bold">{stats.completedChallenges}</span>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Challenges</span>
        </NothingCard>
      </section>

      <section className="flex-1 flex flex-col gap-4">
        <div className="flex justify-between items-center px-2">
          <DotMatrixText className="text-xs tracking-[0.2em] text-muted-foreground">Active Alarms</DotMatrixText>
          <span className="text-xs font-medium text-muted-foreground/40">{alarms.length} Total</span>
        </div>

        <ScrollArea className="h-[calc(100vh-420px)] pr-4 -mr-4">
          <div className="flex flex-col gap-3">
            {loading ? (
              Array(3).fill(0).map((_, i) => (
                <NothingCard key={i} className="animate-pulse h-24 opacity-50" />
              ))
            ) : alarms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-sm">No alarms found. Set one to start your quest.</p>
              </div>
            ) : (
              alarms.map((alarm) => (
                <NothingCard key={alarm.id} className="relative group overflow-hidden">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col">
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-headline font-semibold tracking-tighter">
                          {alarm.time}
                        </span>
                        <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/50">
                          {alarm.difficulty}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground/80 font-medium">
                        {alarm.label || 'No Label'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => deleteAlarm(alarm.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Switch 
                        checked={alarm.enabled} 
                        onCheckedChange={() => toggleAlarm(alarm.id)}
                      />
                    </div>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                      <span 
                        key={i} 
                        className={cn(
                          "w-5 h-5 flex items-center justify-center rounded-full text-[9px] font-bold border transition-colors",
                          alarm.days.includes(i) 
                            ? "bg-primary/20 border-primary/40 text-primary" 
                            : "border-transparent text-muted-foreground/30"
                        )}
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                  {/* Quick test link for demo purposes */}
                  <Link href={`/ringing/${alarm.id}`} className="absolute top-0 right-12 p-2 opacity-0 group-hover:opacity-100">
                    <Bell className="w-3 h-3 text-muted-foreground" />
                  </Link>
                </NothingCard>
              ))
            )}
          </div>
        </ScrollArea>
      </section>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-md px-6">
        <Link href="/alarm/new">
          <Button className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-headline text-lg tracking-tight nothing-glow shadow-2xl">
            <Plus className="w-6 h-6 mr-2" />
            New Alarm
          </Button>
        </Link>
      </div>
    </div>
  );
}
