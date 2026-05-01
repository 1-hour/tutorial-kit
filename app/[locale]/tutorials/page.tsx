import { TutorialCard } from '@/components/tutorial-card';
import { getAllTutorials, getUIStrings, isValidLocale, getLocales } from '@/lib/content';
import type { Locale } from '@/lib/types';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return getLocales().map((locale) => ({ locale }));
}

export default async function TutorialsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const loc = locale as Locale;

  const ui = getUIStrings(loc);
  const tutorials = getAllTutorials(loc);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-2">{ui.list.title}</h1>
      <p className="text-muted-foreground mb-8">
        {tutorials.length} {ui.home.stats.tutorials.toLowerCase()}
      </p>

      {tutorials.length === 0 ? (
        <p className="text-muted-foreground">{ui.list.no_results}</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutorials.map((t) => (
            <TutorialCard key={t.slug} tutorial={t} locale={loc} />
          ))}
        </div>
      )}
    </section>
  );
}
