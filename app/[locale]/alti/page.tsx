import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ALTIEntry } from '@/components/alti-entry';
import {
  getALTI,
  getRoadmap,
  getAllTutorials,
  isValidLocale,
  getLocales,
} from '@/lib/content';
import { buildAlternates } from '@/lib/metadata';
import type { Locale } from '@/lib/types';

export async function generateStaticParams() {
  return getLocales().map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const loc = locale as Locale;
  const title =
    loc === 'zh' ? 'AI 学习人格测试 — ALTI' : 'AI Learning Personality — ALTI';
  const description =
    loc === 'zh'
      ? '4 维 20 题，1 分钟测出你最适合的 AI 学习起点。'
      : '4 dimensions, 20 questions, 1 minute to find your AI learning starting point.';
  return {
    title,
    description,
    alternates: buildAlternates('alti', loc),
    openGraph: { title, description, type: 'website' },
  };
}

export default async function ALTIPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const loc = locale as Locale;

  const data = getALTI();
  const roadmap = getRoadmap();
  const tutorials = getAllTutorials(loc);
  const bySlug = new Map(tutorials.map((t) => [t.slug, t]));

  // Build layer index for result page
  const layerIndex: Record<
    string,
    {
      icon: string;
      color: string;
      name: string;
      firstTutorial?: { slug: string; title: string };
    }
  > = {};
  for (const layer of roadmap.layers) {
    const first = layer.tutorials.map((s) => bySlug.get(s)).find((t) => t);
    layerIndex[layer.id] = {
      icon: layer.icon,
      color: layer.color,
      name: layer.name[loc],
      firstTutorial: first ? { slug: first.slug, title: first.title } : undefined,
    };
  }

  const copy =
    loc === 'zh'
      ? {
          eyebrow: 'AI 学习人格测试',
          title: '1 分钟，找到你的 AI 学习起点',
          desc:
            '4 个维度 · 20 道题。测完我们会推荐最适合你的那一层 —— 不用从头学，直奔你最需要的。',
          start: '开始测试',
          progress: '第 {current} / {total} 题',
          back: '返回上一题',
          yourType: '你的 AI 学习人格',
          recommendedLayer: '推荐从这一层开始',
          startFirstTutorial: '直接开始',
          viewRoadmap: '查看完整路线图',
          retake: '重测一次',
          share: '分享结果',
          shareText: '我的 AI 学习人格是 {type} · {title}，推荐从「{layer}」开始 —— 来 1hour.guide 测测你的：',
        }
      : {
          eyebrow: 'AI Learning Personality',
          title: 'Find your AI starting point in 1 minute',
          desc:
            '4 dimensions · 20 questions. We recommend the right layer so you can skip what you already know.',
          start: 'Start the test',
          progress: 'Question {current} / {total}',
          back: 'Previous question',
          yourType: 'Your AI Learning Type',
          recommendedLayer: 'Start from this layer',
          startFirstTutorial: 'Start now',
          viewRoadmap: 'View full roadmap',
          retake: 'Retake',
          share: 'Share result',
          shareText: "My AI learning type is {type} · {title}. I'm starting with {layer} — take the test at 1hour.guide:",
        };

  return (
    <ALTIEntry
      locale={loc}
      data={data}
      layerIndex={layerIndex}
      copy={copy}
    />
  );
}
