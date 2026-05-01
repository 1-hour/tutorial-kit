/**
 * Type definitions for tutorial-kit
 */

export type Locale = 'en' | 'zh';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export type TranslationStatus = 'published' | 'draft' | 'missing';

/**
 * Site-wide configuration (site.yaml)
 */
export interface SiteConfig {
  defaultLocale: Locale;
  locales: Locale[];
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  domain: string;
  url: string;
  author: {
    name: string;
    url?: string;
    email?: string;
    twitter?: string;
    github?: string;
  };
  theme?: {
    primary?: string;
    primaryGradientEnd?: string;
  };
}

/**
 * Category definition (categories.yaml)
 */
export interface Category {
  slug: string;
  name: Record<Locale, string>;
  icon: string;
  color: string;
  description?: Record<Locale, string>;
}

/**
 * Tutorial metadata (meta.yaml)
 */
export interface TutorialMeta {
  slug: string;
  category: string;
  difficulty: Difficulty;
  duration: number;
  tags: string[];
  date: string;
  published: boolean;
  cover?: string;
  author?: string;
  translations: Record<Locale, { status: TranslationStatus }>;
}

/**
 * Tutorial frontmatter (per-language)
 */
export interface TutorialFrontmatter {
  title: string;
  description: string;
  translator?: string;
}

/**
 * Full tutorial (meta + frontmatter + content)
 */
export interface Tutorial {
  meta: TutorialMeta;
  locale: Locale;
  frontmatter: TutorialFrontmatter;
  content: string;
  readingTime: number;
  /** Available locales (where translations are published) */
  availableLocales: Locale[];
}

/**
 * Tutorial summary (for listing pages, no full content)
 */
export interface TutorialSummary {
  slug: string;
  category: string;
  difficulty: Difficulty;
  duration: number;
  tags: string[];
  date: string;
  cover?: string;
  title: string;
  description: string;
  locale: Locale;
  availableLocales: Locale[];
}

/**
 * UI strings (i18n/<locale>.yaml)
 */
export interface UIStrings {
  nav: {
    tutorials: string;
    categories: string;
    about: string;
  };
  home: {
    hero_title_prefix: string;
    hero_title_highlight: string;
    hero_title_suffix: string;
    hero_description: string;
    cta_browse: string;
    cta_start: string;
    why_title: string;
    why_description: string;
    popular_title: string;
    stats: {
      tutorials: string;
      per_tutorial: string;
      categories: string;
      free: string;
    };
  };
  features: Record<string, { title: string; description: string }>;
  tutorial: {
    time_breakdown: string;
    prerequisites: string;
    what_youll_build: string;
    next_steps: string;
    resources: string;
    checkpoint: string;
    bonus: string;
    show_answer: string;
    on_this_page: string;
    back_to_list: string;
    reading_time: string;
    not_translated_title: string;
    not_translated_description: string;
    view_in_english: string;
  };
  list: {
    title: string;
    filter_category: string;
    filter_difficulty: string;
    filter_duration: string;
    no_results: string;
  };
  difficulty: Record<Difficulty, string>;
  footer: {
    learn: string;
    community: string;
    tagline: string;
    built_by: string;
  };
  common: {
    min: string;
  };
}
