import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getRoadmap,
  getUIStrings,
  getAllTutorials,
  isValidLocale,
  getLocales,
} from '@/lib/content';
import { buildAlternates } from '@/lib/metadata';
import type { Locale, RoadmapLayer } from '@/lib/types';

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
    loc === 'zh' ? 'AI 学习路线图' : 'AI Learning Roadmap';
  const description =
    loc === 'zh'
      ? '从大脑层到变现层，6 层 AI 能力地图。看清自己缺哪一层，再决定学什么。'
      : 'Six layers of AI capability, from foundation to monetization. See what you are missing, then decide what to learn.';
  return {
    title,
    description,
    alternates: buildAlternates('roadmap', loc),
    openGraph: { title, description },
  };
}

/** Layer color tokens — must be static strings for Tailwind JIT */
const COLOR_MAP: Record<
  string,
  { ring: string; bg: string; text: string; dot: string; line: string }
> = {
  violet: {
    ring: 'border-violet-200 dark:border-violet-800',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    text: 'text-violet-700 dark:text-violet-300',
    dot: 'bg-violet-500',
    line: 'bg-violet-200 dark:bg-violet-800',
  },
  blue: {
    ring: 'border-blue-200 dark:border-blue-800',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    text: 'text-blue-700 dark:text-blue-300',
    dot: 'bg-blue-500',
    line: 'bg-blue-200 dark:bg-blue-800',
  },
  pink: {
    ring: 'border-pink-200 dark:border-pink-800',
    bg: 'bg-pink-50 dark:bg-pink-950/40',
    text: 'text-pink-700 dark:text-pink-300',
    dot: 'bg-pink-500',
    line: 'bg-pink-200 dark:bg-pink-800',
  },
  green: {
    ring: 'border-green-200 dark:border-green-800',
    bg: 'bg-green-50 dark:bg-green-950/40',
    text: 'text-green-700 dark:text-green-300',
    dot: 'bg-green-500',
    line: 'bg-green-200 dark:bg-green-800',
  },
  orange: {
    ring: 'border-orange-200 dark:border-orange-800',
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    text: 'text-orange-700 dark:text-orange-300',
    dot: 'bg-orange-500',
    line: 'bg-orange-200 dark:bg-orange-800',
  },
  yellow: {
    ring: 'border-yellow-200 dark:border-yellow-800',
    bg: 'bg-yellow-50 dark:bg-yellow-950/40',
    text: 'text-yellow-700 dark:text-yellow-300',
    dot: 'bg-yellow-500',
    line: 'bg-yellow-200 dark:bg-yellow-800',
  },
};

function getColor(color: string) {
  return COLOR_MAP[color] ?? COLOR_MAP.blue;
}

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const loc = locale as Locale;

  const roadmap = getRoadmap();
  const allTutorials = getAllTutorials(loc);
  const bySlug = new Map(allTutorials.map((t) => [t.slug, t]));

  // Resolve each layer's tutorial slugs to actual tutorial summaries
  const layers = roadmap.layers.map((layer: RoadmapLayer) => ({
    ...layer,
    items: layer.tutorials
      .map((slug) => bySlug.get(slug))
      .filter((t): t is NonNullable<typeof t> => Boolean(t)),
  }));

  const totalTutorials = layers.reduce((n, l) => n + l.items.length, 0);

  const copy =
    loc === 'zh'
      ? {
          eyebrow: 'AI 学习路线图',
          title: '不知道先学哪门课？先看清自己缺哪一层。',
          desc:
            '从大脑、工具、创作、构建、增长到变现，6 层能力地图。公开查看完整路线，选好方向后再决定从哪篇开始。',
          statLayers: '层能力',
          statTutorials: '篇教程',
          statFree: '完全免费',
          start: '从第一层开始',
          browse: '浏览全部教程',
          layerTutorials: '篇教程',
          startHere: '从这里开始',
          empty: '该层暂无已发布教程',
          howtoTitle: '怎么用这张图？',
          howto: [
            '从上往下看，找到你最不熟悉的那一层 —— 那就是你的起点。',
            '每层不用全学，选 1–2 篇最能解决当下问题的。',
            '学完一层就往下走，不要往回啃。',
          ],
        }
      : {
          eyebrow: 'AI Learning Roadmap',
          title: 'Not sure which course to start with? Find out which layer you are missing.',
          desc:
            'Six capability layers: foundation, tools, creation, building, growth, and monetization. Browse the full map, pick a direction, then choose your first tutorial.',
          statLayers: 'layers',
          statTutorials: 'tutorials',
          statFree: 'free',
          start: 'Start from layer one',
          browse: 'Browse all tutorials',
          layerTutorials: 'tutorials',
          startHere: 'Start here',
          empty: 'No published tutorials in this layer yet',
          howtoTitle: 'How to use this map',
          howto: [
            'Read top to bottom and find the layer you know least about — that is your starting point.',
            'You do not need to finish a layer. Pick one or two tutorials that solve your current problem.',
            'Move down once you are done. Do not go back and grind.',
          ],
        };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Hero */}
      <header className="max-w-3xl">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
          {copy.eyebrow}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
          {copy.title}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          {copy.desc}
        </p>
      </header>

      {/* Stats */}
      <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
        <Stat value={layers.length} label={copy.statLayers} />
        <Stat value={totalTutorials} label={copy.statTutorials} />
        <div className="text-sm font-medium text-green-600 dark:text-green-400">
          {copy.statFree}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-8 flex flex-wrap gap-3">
        {layers[0]?.items[0] && (
          <Link
            href={`/${loc}/tutorials/${layers[0].items[0].slug}/`}
            className="inline-flex items-center gap-2 rounded-lg bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {copy.start}
            <span aria-hidden>→</span>
          </Link>
        )}
        <Link
          href={`/${loc}/tutorials/`}
          className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
        >
          {copy.browse}
        </Link>
      </div>

      {/* Layers */}
      <div className="mt-14 space-y-6">
        {layers.map((layer, index) => {
          const c = getColor(layer.color);
          return (
            <section key={layer.id} className="relative">
              {/* connector line */}
              {index < layers.length - 1 && (
                <div className="absolute left-6 top-full h-6 w-px bg-border" aria-hidden />
              )}

              <div
                className={`rounded-2xl border ${c.ring} ${c.bg} p-5 sm:p-6 transition-shadow hover:shadow-sm`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-background text-2xl shadow-sm`}
                    aria-hidden
                  >
                    {layer.icon}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h2 className="text-lg font-semibold">
                        {layer.name[loc]}
                      </h2>
                      <span className={`text-xs font-medium ${c.text}`}>
                        {layer.items.length} {copy.layerTutorials}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {layer.subtitle[loc]}
                    </p>

                    {layer.items.length === 0 ? (
                      <p className="mt-3 text-sm text-muted-foreground italic">
                        {copy.empty}
                      </p>
                    ) : (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {layer.items.map((t, i) => (
                          <li key={t.slug}>
                            <Link
                              href={`/${loc}/tutorials/${t.slug}/`}
                              className="group inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-background/80 px-3 py-1.5 text-sm hover:border-border hover:bg-background transition-colors"
                            >
                              {i === 0 ? (
                                <span
                                  className={`inline-flex items-center gap-1 rounded-md ${c.dot} text-white px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide`}
                                >
                                  <span aria-hidden>★</span>
                                  {copy.startHere}
                                </span>
                              ) : (
                                <span className={`size-1.5 rounded-full ${c.dot}`} aria-hidden />
                              )}
                              <span className="truncate">{t.title}</span>
                              <span className="text-xs text-muted-foreground tabular-nums shrink-0">
                                {t.duration}
                                {getUIStrings(loc).common.min}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* How to use */}
      <section className="mt-14 rounded-2xl border bg-muted/40 p-6 sm:p-8">
        <h2 className="text-lg font-semibold">{copy.howtoTitle}</h2>
        <ol className="mt-4 space-y-2.5">
          {copy.howto.map((line, i) => (
            <li key={i} className="flex gap-3 text-sm text-muted-foreground">
              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-background text-xs font-semibold text-foreground">
                {i + 1}
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-2xl font-bold tabular-nums">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  );
}
