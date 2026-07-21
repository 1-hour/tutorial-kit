import type { Metadata } from 'next';
import { TutorialCard } from '@/components/tutorial-card';
import {
  getCategories,
  getCategoryBySlug,
  getUIStrings,
  getTutorialsByCategory,
  isValidLocale,
  getLocales,
} from '@/lib/content';
import { buildAlternates } from '@/lib/metadata';
import type { Locale } from '@/lib/types';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of getLocales()) {
    for (const cat of getCategories()) {
      params.push({ locale, slug: cat.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) return {};
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  const loc = locale as Locale;
  return {
    title: category.name[loc],
    description: category.description?.[loc],
    alternates: buildAlternates(`categories/${slug}`, loc),
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();
  const loc = locale as Locale;

  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const ui = getUIStrings(loc);
  const tutorials = getTutorialsByCategory(loc, slug);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href={`/${loc}/categories/`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        ← {ui.nav.categories}
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className="text-5xl">{category.icon}</div>
        <div>
          <h1 className="text-4xl font-bold">{category.name[loc]}</h1>
          {category.description && (
            <p className="text-muted-foreground mt-1">{category.description[loc]}</p>
          )}
        </div>
      </div>

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
