'use client';

import { useState } from 'react';
import { ALTIClient } from '@/components/alti-client';
import type { Locale, ALTIData } from '@/lib/types';

type Props = {
  locale: Locale;
  data: ALTIData;
  layerIndex: Parameters<typeof ALTIClient>[0]['layerIndex'];
  copy: Parameters<typeof ALTIClient>[0]['copy'] & {
    eyebrow: string;
    title: string;
    desc: string;
    start: string;
  };
};

/**
 * Thin wrapper: shows an intro screen until the user clicks "start".
 * Then mounts <ALTIClient> which runs the actual test flow.
 */
export function ALTIEntry({ locale, data, layerIndex, copy }: Props) {
  const [started, setStarted] = useState(false);

  if (started) {
    return (
      <ALTIClient
        locale={locale}
        data={data}
        layerIndex={layerIndex}
        copy={copy}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
      <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
        {copy.eyebrow}
      </p>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
        {copy.title}
      </h1>
      <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
        {copy.desc}
      </p>
      <div className="mt-8 flex flex-wrap gap-6 justify-center text-sm text-muted-foreground">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-foreground tabular-nums">4</span>
          <span>{locale === 'zh' ? '维度' : 'dimensions'}</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-foreground tabular-nums">
            {data.questions.length}
          </span>
          <span>{locale === 'zh' ? '道题' : 'questions'}</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl font-bold text-foreground tabular-nums">1</span>
          <span>{locale === 'zh' ? '分钟' : 'minute'}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setStarted(true)}
        className="mt-10 inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-7 py-3.5 text-base font-semibold hover:opacity-90 transition-opacity"
      >
        {copy.start}
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}
