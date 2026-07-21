import type { Metadata } from 'next';
import { getSiteConfig } from './content';
import type { Locale } from './types';

/**
 * Build canonical + languages alternates for a page.
 *
 * @param pathname - path AFTER the locale prefix, e.g. "categories/mind" or ""
 *                   (empty string = locale home). No leading/trailing slash needed.
 * @param currentLocale - the locale of the page being rendered
 * @param availableLocales - which locales publish this page (default: all site locales)
 *
 * Guarantees:
 *   - canonical points to the CURRENT page (self-referential), with trailing slash
 *   - languages includes every available locale + x-default (defaults to site.defaultLocale)
 *   - all URLs are absolute + have trailing slash
 */
export function buildAlternates(
  pathname: string,
  currentLocale: Locale,
  availableLocales?: Locale[],
): NonNullable<Metadata['alternates']> {
  const site = getSiteConfig();
  const baseUrl = site.url.replace(/\/$/, '');
  const clean = pathname.replace(/^\/+|\/+$/g, '');
  const suffix = clean ? `/${clean}/` : '/';

  const locales = availableLocales ?? (site.locales as Locale[]);
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${baseUrl}/${l}${suffix}`;
  }

  // x-default: prefer the site's defaultLocale; fall back to the first available locale
  const xDefaultLocale = locales.includes(site.defaultLocale as Locale)
    ? (site.defaultLocale as Locale)
    : locales[0];
  languages['x-default'] = `${baseUrl}/${xDefaultLocale}${suffix}`;

  return {
    canonical: `${baseUrl}/${currentLocale}${suffix}`,
    languages,
  };
}
