'use client';

import { useState, useEffect, useRef } from 'react';

interface ReadingTimerProps {
  slug: string;
  duration: number; // total minutes
  locale: string;
  labelRemaining?: string;
  labelCompleted?: string;
}

const STORAGE_KEY = 'tutorial-completed';

export function markCompleted(slug: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    if (!list.includes(slug)) {
      list.push(slug);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  } catch {}
}

export function isCompleted(slug: string): boolean {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: string[] = raw ? JSON.parse(raw) : [];
    return list.includes(slug);
  } catch {
    return false;
  }
}

export function ReadingTimer({
  slug,
  duration,
  locale,
  labelRemaining = locale === 'zh' ? '剩余' : 'Remaining',
  labelCompleted = locale === 'zh' ? '已读完' : 'Completed',
}: ReadingTimerProps) {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [startTime] = useState(Date.now());
  const [completed, setCompleted] = useState(false);
  const completedRef = useRef(false);

  // Check if already completed on mount
  useEffect(() => {
    if (isCompleted(slug)) {
      setCompleted(true);
      completedRef.current = true;
    }
  }, [slug]);

  // Track scroll progress
  useEffect(() => {
    const handler = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const p = height > 0 ? winScroll / height : 0;
      setProgress(p);

      // Mark as completed when 95% scrolled
      if (p >= 0.95 && !completedRef.current) {
        completedRef.current = true;
        setCompleted(true);
        markCompleted(slug);
      }

      // Estimate remaining time
      const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
      const avgSpeed = p > 0 ? elapsed / p : 0;
      const remaining = avgSpeed * (1 - p);
      setTimeLeft(Math.max(0, remaining));
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [startTime, slug]);

  const displayTime = completed ? '0' : Math.ceil(timeLeft);

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-background border rounded-lg shadow-lg px-4 py-2 text-sm flex items-center gap-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {completed ? (
          <span className="text-green-600 font-medium">{labelCompleted} ✓</span>
        ) : (
          <>
            <span>{labelRemaining}:</span>
            <span className="font-medium">{displayTime} min</span>
          </>
        )}
      </div>
      <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${Math.min(100, Math.max(0, progress * 100))}%`,
            background: `linear-gradient(90deg, var(--primary) 0%, var(--primary-gradient-end) 100%)`,
          }}
        />
      </div>
    </div>
  );
}
