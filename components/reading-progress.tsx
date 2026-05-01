'use client';

import { useEffect, useState } from 'react';

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handler = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress(height > 0 ? (winScroll / height) * 100 : 0);
    };
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-[3px] z-[9999] transition-[width] duration-100 pointer-events-none"
      style={{
        width: `${progress}%`,
        background: `linear-gradient(90deg, var(--primary) 0%, var(--primary-gradient-end) 100%)`,
      }}
    />
  );
}
