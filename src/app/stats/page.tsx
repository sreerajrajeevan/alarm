"use client"

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, Flame, Calendar, Trophy, Clock, History } from 'lucide-react';
import { DotMatrixText } from '@/components/DotMatrixText';
import { NothingCard } from '@/components/NothingCard';
import { Button } from '@/components/ui/button';
import { useStats } from '@/lib/alarm-store';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const CHART_DATA = [
  { day: 'Mon', time: 7.1 },
  { day: 'Tue', time: 7.0 },
  { day: 'Wed', time: 7.2 },
  { day: 'Thu', time: 7.4 },
  { day: 'Fri', time: 6.9 },
  { day: 'Sat', time: 8.5 },
  { day: 'Sun', time: 8.2 },
];

export default function Statistics() {
  const { stats } = useStats();

  return (
    <div className="max-w-md mx-auto min-h-screen p-6 flex flex-col gap-8">
      <header className="flex items-center gap-4 mt-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full bg-white/5">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <DotMatrixText className="text-xl">Performance</DotMatrixText>
      </header>

      <section className="grid grid-cols-2 gap-4">
        <NothingCard className="flex flex-col gap-1">
          <div className="flex items-center justify-between mb-2">
            <Flame className="w-5 h-5 text-primary" />
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Streak</span>
          </div>
          <span className="text-3xl font-headline font-bold">{stats.streaks}</span>
          <p className="text-[10px] text-muted-foreground">Highest: 24 days</p>
        </NothingCard>
        <NothingCard className="flex flex-col gap-1">
          <div className="flex items-center justify-between mb-2">
            <Trophy className="w-5 h-5 text-primary" />
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Total</span>
          </div>
          <span className="text-3xl font-headline font-bold">{stats.completedChallenges}</span>
          <p className="text-[10px] text-muted-foreground">Level 8 Awake Master</p>
        </NothingCard>
      </section>

      <NothingCard className="h-64 p-4">
        <div className="flex justify-between items-center mb-6">
          <DotMatrixText className="text-xs text-muted-foreground uppercase tracking-widest">Wake-up Trends</DotMatrixText>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3 text-primary" />
            <span className="text-xs font-bold text-primary">Avg: 07:12</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="80%">
          <LineChart data={CHART_DATA}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(217, 225, 232, 0.4)', fontSize: 10, fontWeight: 600 }}
              dy={10}
            />
            <YAxis hide domain={['dataMin - 1', 'dataMax + 1']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#161A1E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
              itemStyle={{ color: '#40BFBF', fontWeight: 700 }}
              labelStyle={{ color: 'rgba(217, 225, 232, 0.4)', fontSize: '10px' }}
            />
            <Line 
              type="monotone" 
              dataKey="time" 
              stroke="#40BFBF" 
              strokeWidth={3} 
              dot={{ fill: '#40BFBF', r: 4 }} 
              activeDot={{ r: 6, stroke: 'white', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </NothingCard>

      <section className="flex flex-col gap-4">
        <DotMatrixText className="text-xs text-muted-foreground uppercase tracking-widest px-2">Quest History</DotMatrixText>
        <div className="flex flex-col gap-2">
          {stats.history.length === 0 ? (
            <p className="text-center py-8 text-sm text-muted-foreground">No history yet. Start your first quest tomorrow!</p>
          ) : (
            stats.history.map((entry, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <History className="w-5 h-5 opacity-40" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{entry.object}</span>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{entry.date}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-headline font-bold text-primary">{entry.time}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">Verified</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <div className="pb-8">
        <Button variant="ghost" className="w-full text-muted-foreground/60 text-xs">
          Export History as CSV
        </Button>
      </div>
    </div>
  );
}
