'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Locale, ALTIData, ALTIResult } from '@/lib/types';

type Props = {
  locale: Locale;
  data: ALTIData;
  /** roadmap layer id → { icon, color, name, firstTutorial } */
  layerIndex: Record<
    string,
    {
      icon: string;
      color: string;
      name: string;
      firstTutorial?: { slug: string; title: string };
    }
  >;
  copy: {
    progress: string; // "第 X / Y 题"
    back: string;
    yourType: string;
    recommendedLayer: string;
    startFirstTutorial: string;
    viewRoadmap: string;
    retake: string;
    share: string;
    shareText: string;
  };
};

/** 单字母匹配规则：第 1 维 EI 的 >=0 → 'E'，<0 → 'I'，等等 */
const DIM_LETTERS = {
  EI: ['E', 'I'],
  SN: ['S', 'N'],
  TF: ['T', 'F'],
  JP: ['J', 'P'],
} as const;

/** 颜色色环 — 跟 roadmap 页保持一致 */
const COLOR_RING: Record<string, string> = {
  violet: 'from-violet-500 to-violet-600',
  blue: 'from-blue-500 to-blue-600',
  pink: 'from-pink-500 to-pink-600',
  green: 'from-green-500 to-green-600',
  orange: 'from-orange-500 to-orange-600',
  yellow: 'from-yellow-500 to-yellow-600',
};

/**
 * 根据回答计算 ALTI type，并匹配 results map。
 * 匹配策略：优先精确四字母匹配，fallback 到按 layer 偏好的 key。
 */
function computeType(
  answers: Record<number, number>,
  questions: ALTIData['questions'],
): string {
  const scores: Record<'EI' | 'SN' | 'TF' | 'JP', number> = {
    EI: 0,
    SN: 0,
    TF: 0,
    JP: 0,
  };
  for (const q of questions) {
    const w = answers[q.id];
    if (typeof w === 'number') scores[q.dim] += w;
  }
  return (
    (scores.EI >= 0 ? DIM_LETTERS.EI[0] : DIM_LETTERS.EI[1]) +
    (scores.SN >= 0 ? DIM_LETTERS.SN[0] : DIM_LETTERS.SN[1]) +
    (scores.TF >= 0 ? DIM_LETTERS.TF[0] : DIM_LETTERS.TF[1]) +
    (scores.JP >= 0 ? DIM_LETTERS.JP[0] : DIM_LETTERS.JP[1])
  );
}

function matchResult(
  type: string,
  results: ALTIData['results'],
): { key: string; result: ALTIResult } | null {
  // 精确匹配
  if (results[type]) return { key: type, result: results[type] };
  // 近似匹配：找共同前缀最长的 key
  const keys = Object.keys(results);
  let best: { key: string; score: number } | null = null;
  for (const k of keys) {
    const base = k.split('_')[0]; // 'INTJ_build' → 'INTJ'
    let score = 0;
    for (let i = 0; i < 4; i++) if (base[i] === type[i]) score++;
    if (!best || score > best.score) best = { key: k, score };
  }
  return best ? { key: best.key, result: results[best.key] } : null;
}

export function ALTIClient({ locale, data, layerIndex, copy }: Props) {
  const questions = data.questions;
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [done, setDone] = useState(false);

  const total = questions.length;
  const current = questions[idx];
  const picked = useMemo(() => {
    if (!done) return null;
    const t = computeType(answers, questions);
    const match = matchResult(t, data.results);
    return { type: t, match };
  }, [answers, done, data.results, questions]);

  const pickOption = (weight: number) => {
    setAnswers((prev) => ({ ...prev, [current.id]: weight }));
    if (idx + 1 < total) {
      setIdx(idx + 1);
    } else {
      setDone(true);
    }
  };

  const goBack = () => {
    if (idx > 0) setIdx(idx - 1);
  };

  const retake = () => {
    setAnswers({});
    setIdx(0);
    setDone(false);
  };

  const share = async () => {
    if (!picked?.match) return;
    const text = copy.shareText
      .replace('{type}', picked.type)
      .replace('{title}', picked.match.result.title[locale])
      .replace('{layer}', layerIndex[picked.match.result.layer]?.name ?? '');
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const full = `${text}\n${url}`;
    if (navigator.share) {
      try {
        await navigator.share({ text: full, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(full);
      alert(locale === 'zh' ? '已复制结果到剪贴板' : 'Copied to clipboard');
    } catch {
      /* ignore */
    }
  };

  if (done && picked?.match) {
    const { result } = picked.match;
    const layer = layerIndex[result.layer];
    const grad = COLOR_RING[layer?.color || 'blue'] ?? COLOR_RING.blue;

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Result hero */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">{copy.yourType}</p>
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="text-4xl" aria-hidden>
              {layer?.icon ?? '🧭'}
            </span>
            <span
              className={`text-2xl font-bold bg-gradient-to-r ${grad} bg-clip-text text-transparent tracking-wide`}
            >
              {picked.type}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {result.title[locale]}
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            {result.desc[locale]}
          </p>
        </div>

        {/* Recommended layer */}
        <div className="mt-10 rounded-2xl border bg-muted/40 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            {copy.recommendedLayer}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <span className="text-3xl" aria-hidden>
              {layer?.icon}
            </span>
            <h2 className="text-xl font-semibold">{layer?.name}</h2>
          </div>

          {layer?.firstTutorial && (
            <Link
              href={`/${locale}/tutorials/${layer.firstTutorial.slug}/`}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {copy.startFirstTutorial}: {layer.firstTutorial.title}
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link
            href={`/${locale}/roadmap/`}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            {copy.viewRoadmap}
          </Link>
          <button
            type="button"
            onClick={share}
            className="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
          >
            {copy.share}
          </button>
          <button
            type="button"
            onClick={retake}
            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {copy.retake}
          </button>
        </div>
      </div>
    );
  }

  // Question view
  const pct = Math.round(((idx + 1) / total) * 100);
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>
            {copy.progress
              .replace('{current}', String(idx + 1))
              .replace('{total}', String(total))}
          </span>
          <span className="tabular-nums">{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-foreground transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h1 className="text-xl sm:text-2xl font-semibold leading-snug mb-6 whitespace-pre-line">
        {current.text[locale]}
      </h1>

      {/* Options */}
      <div className="space-y-3">
        {current.options.map((opt, i) => {
          const selected = answers[current.id] === opt.weight;
          return (
            <button
              key={i}
              type="button"
              onClick={() => pickOption(opt.weight)}
              className={`w-full text-left rounded-xl border p-4 sm:p-5 text-sm sm:text-base transition-all hover:border-foreground hover:bg-muted/40 ${
                selected ? 'border-foreground bg-muted/40' : ''
              }`}
            >
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-md border bg-background text-xs font-semibold mr-3">
                {String.fromCharCode(65 + i)}
              </span>
              {opt.text[locale]}
            </button>
          );
        })}
      </div>

      {/* Back */}
      {idx > 0 && (
        <button
          type="button"
          onClick={goBack}
          className="mt-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          ← {copy.back}
        </button>
      )}
    </div>
  );
}
