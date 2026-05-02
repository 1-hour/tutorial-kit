import type { MetadataRoute } from 'next';
import {
  getSiteConfig,
  getAllTutorialSlugs,
  getTutorialMeta,
  getLocales,
  isTutorialPublishedInLocale,
  getCategories,
} from '@/lib/content';
import type { Locale } from '@/lib/types';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteConfig();
  const locales = getLocales();
  const baseUrl = site.url.replace(/\/$/, '');
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Root (redirect)
  entries.push({
    url: `${baseUrl}/`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 1.0,
  });

  for (const locale of locales) {
    const alternates = Object.fromEntries(
      locales.map((l) => [l, `${baseUrl}/${l}/`])
    ) as Record<string, string>;

    // Home
    entries.push({
      url: `${baseUrl}/${locale}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: { languages: alternates },
    });

    // Static pages
    for (const path of ['tutorials', 'categories', 'about']) {
      const pageAlternates = Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}/${path}/`])
      ) as Record<string, string>;
      entries.push({
        url: `${baseUrl}/${locale}/${path}/`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: { languages: pageAlternates },
      });
    }

    // Categories
    for (const cat of getCategories()) {
      const catAlternates = Object.fromEntries(
        locales.map((l) => [l, `${baseUrl}/${l}/categories/${cat.slug}/`])
      ) as Record<string, string>;
      entries.push({
        url: `${baseUrl}/${locale}/categories/${cat.slug}/`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: { languages: catAlternates },
      });
    }

    // Tutorials (only published in this locale)
    for (const slug of getAllTutorialSlugs()) {
      const meta = getTutorialMeta(slug);
      if (!meta) continue;
      if (!isTutorialPublishedInLocale(meta, locale as Locale)) continue;

      const availableIn = locales.filter((l) =>
        isTutorialPublishedInLocale(meta, l as Locale)
      );
      const tutAlternates = Object.fromEntries(
        availableIn.map((l) => [l, `${baseUrl}/${l}/tutorials/${slug}/`])
      ) as Record<string, string>;

      entries.push({
        url: `${baseUrl}/${locale}/tutorials/${slug}/`,
        lastModified: meta.date ? new Date(meta.date) : now,
        changeFrequency: 'monthly',
        priority: 0.9,
        alternates: { languages: tutAlternates },
      });
    }
  }

  return entries;
}
