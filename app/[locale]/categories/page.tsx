import Link from 'next/link';
import {
  getCategories,
  getUIStrings,
  getAllTutorials,
  isValidLocale,
  getLocales,
} from '@/lib/content';
import type { Locale } from '@/lib/types';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return getLocales().map((locale) => ({ locale }));
}

const CATEGORY_GRADIENT: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600',
  purple: 'from-purple-500 to-purple-600',
  pink: 'from-pink-500 to-pink-600',
  green: 'from-green-500 to-green-600',
  cyan: 'from-cyan-500 to-cyan-600',
  orange: 'from-orange-500 to-orange-600',
};

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();
  const loc = locale as Locale;

  const ui = getUIStrings(loc);
  const categories = getCategories();
  const allTutorials = getAllTutorials(loc);

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-2">{ui.nav.categories}</h1>
      <p className="text-muted-foreground mb-8">
        {categories.length} {ui.home.stats.categories.toLowerCase()}
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const count = allTutorials.filter((t) => t.category === cat.slug).length;
          return (
            <Link
              key={cat.slug}
              href={`/${loc}/categories/${cat.slug}/`}
              className="block rounded-xl border overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div
                className={`h-28 bg-gradient-to-br ${CATEGORY_GRADIENT[cat.color] || CATEGORY_GRADIENT.blue} flex items-center justify-center text-5xl`}
              >
                {cat.icon}
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-1">{cat.name[loc]}</h3>
                {cat.description && (
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {cat.description[loc]}
                  </p>
                )}
                <div className="text-xs text-muted-foreground">
                  {count} {ui.home.stats.tutorials.toLowerCase()}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
