'use client';

import { useState, useEffect } from 'react';
import { isCompleted } from './reading-timer';

export function CompletedBadge({ slug, locale }: { slug: string; locale: string }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDone(isCompleted(slug));
  }, [slug]);

  if (!done) return null;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 font-medium">
      ✓ {locale === 'zh' ? '已完成' : 'Done'}
    </span>
  );
}
