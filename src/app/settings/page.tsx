"use client"

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Info, Moon, Sun, Sliders, ShieldAlert, RotateCcw } from 'lucide-react';
import { DotMatrixText } from '@/components/DotMatrixText';
import { NothingCard } from '@/components/NothingCard';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useSettings, useStats } from '@/lib/alarm-store';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { resetStats } = useStats();
  const { toast } = useToast();

  const handleReset = () => {
    resetStats();
    toast({
      title: "Stats Reset",
      description: "All your history and streaks have been cleared.",
    });
  };

  return (
    <div className="max-w-md mx-auto min-h-screen p-6 flex flex-col gap-8">
      <header className="flex items-center gap-4 mt-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full bg-white/5">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <DotMatrixText className="text-xl">Settings</DotMatrixText>
      </header>

      <section className="flex flex-col gap-6">
        <div className="space-y-4">
          <DotMatrixText className="text-xs text-muted-foreground uppercase tracking-widest px-2">AI Preferences</DotMatrixText>
          <NothingCard className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-sm font-bold">Vision Sensitivity</span>
                  <span className="text-[10px] text-muted-foreground">Adjust AI object identification threshold</span>
                </div>
                <span className="text-primary font-headline font-bold">{(settings.aiSensitivity * 100).toFixed(0)}%</span>
              </div>
              <Slider 
                value={[settings.aiSensitivity * 100]} 
                onValueChange={([val]) => updateSettings({ aiSensitivity: val / 100 })}
                max={100} 
                min={50} 
                step={1}
                className="py-4"
              />
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground/60">
                <ShieldAlert className="w-3 h-3" />
                <span>Higher sensitivity is harder but prevents cheating.</span>
              </div>
            </div>
          </NothingCard>
        </div>

        <div className="space-y-4">
          <DotMatrixText className="text-xs text-muted-foreground uppercase tracking-widest px-2">Global Defaults</DotMatrixText>
          <NothingCard className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-sm font-bold">Haptic Feedback</span>
                <span className="text-[10px] text-muted-foreground">Vibrate during alarm ringing</span>
              </div>
              <Switch 
                checked={settings.vibrationEnabled} 
                onCheckedChange={(val) => updateSettings({ vibrationEnabled: val })} 
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-sm font-bold">Smart Volume</span>
                <span className="text-[10px] text-muted-foreground">Auto ramp-up for all new alarms</span>
              </div>
              <Switch 
                checked={settings.rampUpEnabled} 
                onCheckedChange={(val) => updateSettings({ rampUpEnabled: val })} 
              />
            </div>
          </NothingCard>
        </div>

        <div className="space-y-4">
          <DotMatrixText className="text-xs text-muted-foreground uppercase tracking-widest px-2">Danger Zone</DotMatrixText>
          <NothingCard className="border-destructive/20 bg-destructive/5">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-destructive">Reset Statistics</span>
                <span className="text-[10px] text-destructive/60">Permanently clear streaks and history</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-destructive hover:bg-destructive/10"
                onClick={handleReset}
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
            </div>
          </NothingCard>
        </div>
      </section>

      <div className="mt-auto pb-8 text-center">
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em]">Build 2024.11.08-Alpha</p>
      </div>
    </div>
  );
}
