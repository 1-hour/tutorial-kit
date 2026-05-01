import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { format } from 'date-fns';
import {
  getTutorial,
  getAllTutorialSlugs,
  getTutorialMeta,
  getCategoryBySlug,
  getUIStrings,
  getSiteConfig,
  isValidLocale,
  isTutorialPublishedInLocale,
  getTutorialAvailableLocales,
  getLocales,
} from '@/lib/content';
import { ReadingProgress } from '@/components/reading-progress';
import { MDXContent } from '@/components/mdx-content';
import type { Locale } from '@/lib/types';

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  const slugs = getAllTutorialSlugs();
  for (const locale of getLocales()) {
    for (const slug of slugs) {
      const meta = getTutorialMeta(slug);
      if (!meta) continue;
      if (isTutorialPublishedInLocale(meta, locale)) {
        params.push({ locale, slug });
      }
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
  const loc = locale as Locale;
  const tut = getTutorial(slug, loc);
  if (!tut) return {};

  const site = getSiteConfig();
  const alternates: Record<string, string> = {};
  for (const l of tut.availableLocales) {
    alternates[l] = `${site.url}/${l}/tutorials/${slug}/`;
  }

  return {
    title: tut.frontmatter.title,
    description: tut.frontmatter.description,
    alternates: {
      canonical: `/${loc}/tutorials/${slug}/`,
      languages: alternates,
    },
    openGraph: {
      title: tut.frontmatter.title,
      description: tut.frontmatter.description,
      url: `${site.url}/${loc}/tutorials/${slug}/`,
      type: 'article',
      publishedTime: tut.meta.date,
      tags: tut.meta.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: tut.frontmatter.title,
      description: tut.frontmatter.description,
    },
  };
}

const CATEGORY_BADGE_COLORS: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
};

export default async function TutorialPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isValidLocale(locale)) notFound();
  const loc = locale as Locale;

  const tut = getTutorial(slug, loc);
  if (!tut) notFound();

  const ui = getUIStrings(loc);
  const category = getCategoryBySlug(tut.meta.category);
  const color = category?.color || 'blue';
  const dateFormatted = (() => {
    try {
      return format(new Date(tut.meta.date), 'MMM d, yyyy');
    } catch {
      return tut.meta.date;
    }
  })();

  return (
    <>
      <ReadingProgress />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href={`/${loc}/tutorials/`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          ← {ui.tutorial.back_to_list}
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-4">
            {category && (
              <span className={`px-2 py-0.5 rounded ${CATEGORY_BADGE_COLORS[color]}`}>
                {category.icon} {category.name[loc]}
              </span>
            )}
            <span>•</span>
            <span>{tut.meta.duration} {ui.common.min}</span>
            <span>•</span>
            <span>{ui.difficulty[tut.meta.difficulty]}</span>
            <span>•</span>
            <span>{dateFormatted}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 leading-tight">
            {tut.frontmatter.title}
          </h1>
          <p className="text-xl text-muted-foreground">{tut.frontmatter.description}</p>

          {/* Tags */}
          {tut.meta.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tut.meta.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 text-xs rounded bg-muted text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Body */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <MDXContent source={tut.content} locale={loc} />
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t">
          <Link
            href={`/${loc}/tutorials/`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            ← {ui.tutorial.back_to_list}
          </Link>
        </div>
      </article>
    </>
  );
}
