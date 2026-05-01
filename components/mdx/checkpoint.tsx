'use client';

import { useState } from 'react';

export function TimeBlock({ start, end, title }: { start: number | string; end: number | string; title: string }) {
  return (
    <div className="flex items-center gap-3 py-2 px-4 rounded-lg bg-muted my-2">
      <div className="flex items-center gap-1 font-mono text-sm text-[color:var(--primary)] font-semibold min-w-[90px]">
        <span>{start}</span>
        <span className="text-muted-foreground">–</span>
        <span>{end}</span>
        <span className="text-xs text-muted-foreground ml-1">min</span>
      </div>
      <div className="flex-1 text-sm">{title}</div>
    </div>
  );
}

export function Checkpoint({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 p-5 rounded-lg border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30 not-prose">
      <div className="flex items-center gap-2 mb-2 text-blue-900 dark:text-blue-200">
        <span className="text-lg">✅</span>
        <h4 className="font-semibold m-0">Checkpoint</h4>
      </div>
      <div className="text-sm text-blue-900 dark:text-blue-100 prose prose-sm dark:prose-invert max-w-none">
        {children}
      </div>
    </div>
  );
}

export function Answer({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm font-medium text-blue-700 dark:text-blue-300 hover:underline cursor-pointer"
      >
        {open ? '▼' : '▶'} Show answer
      </button>
      {open && (
        <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
          {children}
        </div>
      )}
    </div>
  );
}
