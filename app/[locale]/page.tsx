import Link from 'next/link';
import type { Metadata } from 'next';
import { TutorialCard } from '@/components/tutorial-card';
import { getAllTutorials, getUIStrings, getCategories, getRoadmap, isValidLocale } from '@/lib/content';
import { buildAlternates } from '@/lib/metadata';
import type { Locale } from '@/lib/types';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  return {
    alternates: buildAlternates('', locale as Locale),
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const loc = locale as Locale;

  const ui = getUIStrings(loc);
  const tutorials = getAllTutorials(loc).slice(0, 3);
  const categories = getCategories();
  const roadmap = getRoadmap();

  const roadCopy =
    loc === 'zh'
      ? {
          eyebrow: 'AI 学习路线图',
          title: '不知道先学哪门课？先看清自己缺哪一层。',
          desc: '6 层能力地图：大脑、工具、创作、构建、增长、变现。公开查看完整路线，选好方向再决定从哪篇开始。',
          cta: '查看学习路线图',
          altiTitle: '不想从头看？',
          altiDesc: '1 分钟测一下你的 AI 学习人格，直接推荐你该从哪一层起步。',
          altiCta: '开始测试',
          altiBadge: 'NEW',
        }
      : {
          eyebrow: 'AI Learning Roadmap',
          title: 'Not sure which course to start with? Find out which layer you are missing.',
          desc: 'Six capability layers: foundation, tools, creation, building, growth, and monetization. Browse the full map, then pick your first tutorial.',
          cta: 'View the roadmap',
          altiTitle: 'Skip the browsing?',
          altiDesc: 'Take a 1-minute personality test and we will recommend your starting layer directly.',
          altiCta: 'Take the test',
          altiBadge: 'NEW',
        };

  const featureKeys = ['timeboxed', 'outcome', 'checkpoint', 'beginner', 'nextsteps', 'bonus'];

  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
          {ui.home.hero_title_prefix}{' '}
          <span className="gradient-text">{ui.home.hero_title_highlight}</span>
          {ui.home.hero_title_suffix}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          {ui.home.hero_description}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${loc}/tutorials/`}
            className="px-6 py-3 text-white rounded-lg font-medium transition-opacity hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, var(--primary) 0%, var(--primary-gradient-end) 100%)`,
            }}
          >
            {ui.home.cta_browse}
          </Link>
          <Link
            href={`/${loc}/about/`}
            className="px-6 py-3 border rounded-lg font-medium hover:bg-muted transition-colors"
          >
            {ui.nav.about}
          </Link>
        </div>
      </section>

      {/* Roadmap teaser — 6-layer AI learning map */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Link
          href={`/${loc}/roadmap/`}
          className="group block rounded-2xl border bg-gradient-to-br from-muted/50 to-background p-6 sm:p-8 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {roadCopy.eyebrow}
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
                {roadCopy.title}
              </h2>
              <p className="mt-3 text-muted-foreground text-sm sm:text-base max-w-2xl">
                {roadCopy.desc}
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground">
                {roadCopy.cta}
                <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 lg:max-w-sm">
              {roadmap.layers.map((layer) => (
                <div
                  key={layer.id}
                  className="inline-flex items-center gap-1.5 rounded-lg border bg-background px-2.5 py-1.5 text-xs"
                >
                  <span aria-hidden>{layer.icon}</span>
                  <span className="font-medium">{layer.name[loc]}</span>
                </div>
              ))}
            </div>
          </div>
        </Link>

        {/* ALTI quick link */}
        <Link
          href={`/${loc}/alti/`}
          className="group mt-4 flex items-center justify-between gap-4 rounded-2xl border bg-background p-4 sm:p-5 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-3 min-w-0">
            <span className="text-2xl shrink-0" aria-hidden>🧭</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-base">{roadCopy.altiTitle}</h3>
                <span className="inline-flex items-center rounded-md bg-foreground text-background px-1.5 py-0.5 text-[10px] font-bold tracking-wide">
                  {roadCopy.altiBadge}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">
                {roadCopy.altiDesc}
              </p>
            </div>
          </div>
          <span className="text-sm font-medium shrink-0 inline-flex items-center gap-1">
            {roadCopy.altiCta}
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </span>
        </Link>
      </section>

      {/* Stats */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-y">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold gradient-text">{tutorials.length}+</div>
            <div className="text-sm text-muted-foreground mt-1">{ui.home.stats.tutorials}</div>
          </div>
          <div>
            <div className="text-3xl font-bold gradient-text">60{ui.common.min}</div>
            <div className="text-sm text-muted-foreground mt-1">{ui.home.stats.per_tutorial}</div>
          </div>
          <div>
            <div className="text-3xl font-bold gradient-text">{categories.length}</div>
            <div className="text-sm text-muted-foreground mt-1">{ui.home.stats.categories}</div>
          </div>
          <div>
            <div className="text-3xl font-bold gradient-text">100%</div>
            <div className="text-sm text-muted-foreground mt-1">{ui.home.stats.free}</div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{ui.home.why_title}</h2>
          <p className="text-muted-foreground">{ui.home.why_description}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {featureKeys.map((key) => {
            const f = ui.features[key];
            if (!f) return null;
            return (
              <div key={key} className="p-6 rounded-xl border hover:-translate-y-1 hover:shadow-lg transition-all">
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Popular */}
      {tutorials.length > 0 && (
        <section className="bg-muted/50 py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-3xl font-bold">{ui.home.popular_title}</h2>
              <Link
                href={`/${loc}/tutorials/`}
                className="text-sm text-[color:var(--primary)] hover:underline"
              >
                {ui.home.cta_browse} →
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {tutorials.map((t) => (
                <TutorialCard key={t.slug} tutorial={t} locale={loc} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
