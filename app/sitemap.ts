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

/**
 * Build `alternates.languages` for a given path suffix (starting with `/`).
 * Includes every locale + x-default (points at site.defaultLocale).
 * If `availableIn` is provided, only those locales are included (used for
 * per-tutorial availability).
 */
function altLangs(
  baseUrl: string,
  suffix: string,
  defaultLocale: string,
  availableIn: string[],
): Record<string, string> {
  const langs: Record<string, string> = {};
  for (const l of availableIn) {
    langs[l] = `${baseUrl}/${l}${suffix}`;
  }
  const xDefault = availableIn.includes(defaultLocale) ? defaultLocale : availableIn[0];
  langs['x-default'] = `${baseUrl}/${xDefault}${suffix}`;
  return langs;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const site = getSiteConfig();
  const locales = getLocales();
  const baseUrl = site.url.replace(/\/$/, '');
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date();

  // NOTE: root URL `/` is intentionally NOT in the sitemap.
  // It 302-redirects to /{defaultLocale}/ at the edge (Cloudflare `_redirects`
  // file), so it must not be declared as a canonical URL. Sitemap should only
  // list the concrete locale-scoped pages.

  for (const locale of locales) {
    // Home
    entries.push({
      url: `${baseUrl}/${locale}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
      alternates: { languages: altLangs(baseUrl, '/', site.defaultLocale, locales) },
    });

    // Static pages
    for (const path of ['tutorials', 'categories', 'about']) {
      entries.push({
        url: `${baseUrl}/${locale}/${path}/`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: {
          languages: altLangs(baseUrl, `/${path}/`, site.defaultLocale, locales),
        },
      });
    }

    // Categories
    for (const cat of getCategories()) {
      entries.push({
        url: `${baseUrl}/${locale}/categories/${cat.slug}/`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.6,
        alternates: {
          languages: altLangs(baseUrl, `/categories/${cat.slug}/`, site.defaultLocale, locales),
        },
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

      entries.push({
        url: `${baseUrl}/${locale}/tutorials/${slug}/`,
        lastModified: meta.date ? new Date(meta.date) : now,
        changeFrequency: 'monthly',
        priority: 0.9,
        alternates: {
          languages: altLangs(baseUrl, `/tutorials/${slug}/`, site.defaultLocale, availableIn),
        },
      });
    }
  }

  return entries;
}
