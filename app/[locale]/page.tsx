import Link from 'next/link';
import { TutorialCard } from '@/components/tutorial-card';
import { getAllTutorials, getUIStrings, getCategories, isValidLocale } from '@/lib/content';
import type { Locale } from '@/lib/types';
import { notFound } from 'next/navigation';

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
