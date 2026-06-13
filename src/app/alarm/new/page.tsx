"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, Info } from 'lucide-react';
import { DotMatrixText } from '@/components/DotMatrixText';
import { NothingCard } from '@/components/NothingCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAlarms, Difficulty } from '@/lib/alarm-store';
import { cn } from '@/lib/utils';

export default function NewAlarm() {
  const router = useRouter();
  const { addAlarm } = useAlarms();
  
  const [time, setTime] = useState('07:00');
  const [label, setLabel] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [vibrate, setVibrate] = useState(true);
  const [rampUp, setRampUp] = useState(false);

  const toggleDay = (dayIndex: number) => {
    setSelectedDays(prev => 
      prev.includes(dayIndex) 
        ? prev.filter(d => d !== dayIndex) 
        : [...prev, dayIndex]
    );
  };

  const handleSave = () => {
    addAlarm({
      time,
      label,
      difficulty,
      days: selectedDays,
      enabled: true,
      vibrate,
      rampUp
    });
    router.push('/');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen p-6 flex flex-col gap-6">
      <header className="flex justify-between items-center mt-4">
        <Button variant="ghost" size="icon" className="rounded-full bg-white/5" onClick={() => router.back()}>
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <DotMatrixText className="text-xl">Set Alarm</DotMatrixText>
        <Button variant="ghost" size="icon" className="rounded-full bg-white/5 text-primary" onClick={handleSave}>
          <Check className="w-6 h-6" />
        </Button>
      </header>

      <section className="flex justify-center py-8">
        <Input 
          type="time" 
          value={time} 
          onChange={(e) => setTime(e.target.value)}
          className="bg-transparent border-none text-7xl h-auto font-headline font-bold text-center tracking-tighter focus-visible:ring-0 p-0 selection:bg-transparent"
        />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex justify-between gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <button
              key={i}
              onClick={() => toggleDay(i)}
              className={cn(
                "flex-1 aspect-square flex items-center justify-center rounded-xl text-xs font-bold transition-all duration-300",
                selectedDays.includes(i) 
                  ? "bg-primary text-background border-transparent" 
                  : "bg-white/5 text-muted-foreground border border-white/5"
              )}
            >
              {day}
            </button>
          ))}
        </div>

        <NothingCard className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Difficulty</Label>
            <Tabs value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
              <TabsList className="w-full bg-white/5 border border-white/10 p-1 h-12">
                <TabsTrigger value="easy" className="flex-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-background font-headline text-xs">Easy</TabsTrigger>
                <TabsTrigger value="medium" className="flex-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-background font-headline text-xs">Medium</TabsTrigger>
                <TabsTrigger value="hard" className="flex-1 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-background font-headline text-xs">Hard</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60 px-1 mt-1">
              <Info className="w-3 h-3" />
              <span>Higher difficulty requires more specific objects.</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Label</Label>
            <Input 
              placeholder="E.g., Morning Coffee"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="bg-white/5 border-white/10 rounded-xl focus-visible:ring-primary/20 placeholder:text-muted-foreground/30 h-12"
            />
          </div>
        </NothingCard>

        <NothingCard className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Vibration</span>
              <span className="text-[10px] text-muted-foreground">Tactile feedback on wake</span>
            </div>
            <Switch checked={vibrate} onCheckedChange={setVibrate} />
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Volume Ramp-up</span>
              <span className="text-[10px] text-muted-foreground">Gradual volume increase</span>
            </div>
            <Switch checked={rampUp} onCheckedChange={setRampUp} />
          </div>
        </NothingCard>
      </section>

      <div className="mt-auto pb-4">
        <Button 
          onClick={handleSave}
          className="w-full h-14 rounded-2xl bg-primary text-background hover:bg-primary/90 font-headline text-lg tracking-tight nothing-glow shadow-xl"
        >
          Save Alarm
        </Button>
      </div>
    </div>
  );
}
