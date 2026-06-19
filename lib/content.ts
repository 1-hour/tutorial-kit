/**
 * Content loader - reads from external content repository
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import readingTime from 'reading-time';
import type {
  Locale,
  SiteConfig,
  Category,
  TutorialMeta,
  TutorialFrontmatter,
  Tutorial,
  TutorialSummary,
  UIStrings,
} from './types';

/**
 * Get the content directory.
 * Defaults to ../1hour-guide-content relative to the framework root.
 * Can be overridden via CONTENT_DIR env var.
 */
export function getContentDir(): string {
  if (process.env.CONTENT_DIR) {
    return path.resolve(process.env.CONTENT_DIR);
  }
  return path.resolve(process.cwd(), '../1hour-guide-content');
}

/**
 * Load site configuration (cached per process)
 */
let siteConfigCache: SiteConfig | null = null;
export function getSiteConfig(): SiteConfig {
  if (siteConfigCache) return siteConfigCache;
  const filePath = path.join(getContentDir(), 'site.yaml');
  const raw = fs.readFileSync(filePath, 'utf-8');
  siteConfigCache = yaml.load(raw) as SiteConfig;
  return siteConfigCache;
}

/**
 * Load categories (cached per process)
 */
let categoriesCache: Category[] | null = null;
export function getCategories(): Category[] {
  if (categoriesCache) return categoriesCache;
  const filePath = path.join(getContentDir(), 'categories.yaml');
  const raw = fs.readFileSync(filePath, 'utf-8');
  categoriesCache = yaml.load(raw) as Category[];
  return categoriesCache;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return getCategories().find((c) => c.slug === slug);
}

/**
 * Get supported locales from site config
 */
export function getLocales(): Locale[] {
  return getSiteConfig().locales;
}

/**
 * Get default locale
 */
export function getDefaultLocale(): Locale {
  return getSiteConfig().defaultLocale;
}

/**
 * Validate a locale string
 */
export function isValidLocale(locale: string): locale is Locale {
  return getLocales().includes(locale as Locale);
}

/**
 * Load UI strings for a locale (cached per locale)
 */
const uiStringsCache: Partial<Record<Locale, UIStrings>> = {};
export function getUIStrings(locale: Locale): UIStrings {
  if (uiStringsCache[locale]) return uiStringsCache[locale]!;
  const filePath = path.join(getContentDir(), 'i18n', `${locale}.yaml`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  const parsed = yaml.load(raw) as UIStrings;
  uiStringsCache[locale] = parsed;
  return parsed;
}

/**
 * Get all tutorial slugs
 */
export function getAllTutorialSlugs(): string[] {
  const tutorialsDir = path.join(getContentDir(), 'tutorials');
  if (!fs.existsSync(tutorialsDir)) return [];
  return fs
    .readdirSync(tutorialsDir)
    .filter((name) => {
      const fullPath = path.join(tutorialsDir, name);
      return fs.statSync(fullPath).isDirectory();
    });
}

/**
 * Load tutorial metadata for a slug
 */
export function getTutorialMeta(slug: string): TutorialMeta | null {
  const metaPath = path.join(getContentDir(), 'tutorials', slug, 'meta.yaml');
  if (!fs.existsSync(metaPath)) return null;
  const raw = fs.readFileSync(metaPath, 'utf-8');
  const meta = yaml.load(raw) as TutorialMeta;
  // js-yaml parses unquoted `date: 2026-06-20` into a JS Date. Normalize to
  // a YYYY-MM-DD string so downstream (metadata, JSON-LD, sort) gets a stable
  // primitive.
  if (meta && (meta as unknown as { date: unknown }).date instanceof Date) {
    const d = (meta as unknown as { date: Date }).date;
    (meta as unknown as { date: string }).date = d.toISOString().slice(0, 10);
  }
  return meta;
}

/**
 * Check if a locale version of a tutorial is published
 */
export function isTutorialPublishedInLocale(meta: TutorialMeta, locale: Locale): boolean {
  if (!meta.published) return false;
  const t = meta.translations?.[locale];
  return t?.status === 'published';
}

/**
 * Get available locales for a tutorial
 */
export function getTutorialAvailableLocales(meta: TutorialMeta): Locale[] {
  if (!meta.published || !meta.translations) return [];
  const locales: Locale[] = [];
  for (const [loc, info] of Object.entries(meta.translations)) {
    if (info.status === 'published') {
      locales.push(loc as Locale);
    }
  }
  return locales;
}

/**
 * Load a single tutorial (meta + frontmatter + content)
 */
export function getTutorial(slug: string, locale: Locale): Tutorial | null {
  const meta = getTutorialMeta(slug);
  if (!meta) return null;
  if (!isTutorialPublishedInLocale(meta, locale)) return null;

  const mdxPath = path.join(getContentDir(), 'tutorials', slug, `${locale}.mdx`);
  if (!fs.existsSync(mdxPath)) return null;

  const raw = fs.readFileSync(mdxPath, 'utf-8');
  const { data, content } = matter(raw);
  const frontmatter = data as TutorialFrontmatter;
  const stats = readingTime(content);

  return {
    meta,
    locale,
    frontmatter,
    content,
    readingTime: Math.ceil(stats.minutes),
    availableLocales: getTutorialAvailableLocales(meta),
  };
}

/**
 * Get all tutorial summaries for a given locale (published + translated)
 */
export function getAllTutorials(locale: Locale): TutorialSummary[] {
  const slugs = getAllTutorialSlugs();
  const summaries: TutorialSummary[] = [];

  for (const slug of slugs) {
    const meta = getTutorialMeta(slug);
    if (!meta) continue;
    if (!isTutorialPublishedInLocale(meta, locale)) continue;

    const mdxPath = path.join(getContentDir(), 'tutorials', slug, `${locale}.mdx`);
    if (!fs.existsSync(mdxPath)) continue;

    const raw = fs.readFileSync(mdxPath, 'utf-8');
    const { data } = matter(raw);
    const fm = data as TutorialFrontmatter;

    summaries.push({
      slug: meta.slug,
      category: meta.category,
      difficulty: meta.difficulty,
      duration: meta.duration,
      tags: meta.tags,
      date: meta.date,
      cover: meta.cover,
      title: fm.title,
      description: fm.description,
      locale,
      availableLocales: getTutorialAvailableLocales(meta),
    });
  }

  // Sort by date desc
  return summaries.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * Get tutorials by category
 */
export function getTutorialsByCategory(locale: Locale, categorySlug: string): TutorialSummary[] {
  return getAllTutorials(locale).filter((t) => t.category === categorySlug);
}
