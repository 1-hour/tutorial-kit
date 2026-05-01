import Link from 'next/link';
import { getCategoryBySlug, getUIStrings } from '@/lib/content';
import type { Locale, TutorialSummary } from '@/lib/types';

const CATEGORY_COLORS: Record<string, string> = {
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  green: 'bg-green-500',
  cyan: 'bg-cyan-500',
  orange: 'bg-orange-500',
};

const CATEGORY_BADGE_COLORS: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  pink: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  green: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  cyan: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
};

const CATEGORY_GRADIENT: Record<string, string> = {
  blue: 'from-blue-500 to-blue-600',
  purple: 'from-purple-500 to-purple-600',
  pink: 'from-pink-500 to-pink-600',
  green: 'from-green-500 to-green-600',
  cyan: 'from-cyan-500 to-cyan-600',
  orange: 'from-orange-500 to-orange-600',
};

export function TutorialCard({
  tutorial,
  locale,
  compact = false,
}: {
  tutorial: TutorialSummary;
  locale: Locale;
  compact?: boolean;
}) {
  const category = getCategoryBySlug(tutorial.category);
  const ui = getUIStrings(locale);
  const color = category?.color || 'blue';

  return (
    <Link
      href={`/${locale}/tutorials/${tutorial.slug}/`}
      className="block bg-background rounded-xl border overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
    >
      <div
        className={`${compact ? 'h-24' : 'h-32'} bg-gradient-to-br ${CATEGORY_GRADIENT[color] || CATEGORY_GRADIENT.blue} flex items-center justify-center text-5xl`}
      >
        {category?.icon || '📚'}
      </div>
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
          {category && (
            <span className={`px-2 py-0.5 rounded ${CATEGORY_BADGE_COLORS[color] || CATEGORY_BADGE_COLORS.blue}`}>
              {category.name[locale]}
            </span>
          )}
          <span>•</span>
          <span>{tutorial.duration} {ui.common.min}</span>
          <span>•</span>
          <span>{ui.difficulty[tutorial.difficulty]}</span>
        </div>
        <h3 className="font-semibold text-base mb-1.5 leading-snug">{tutorial.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{tutorial.description}</p>
      </div>
    </Link>
  );
}
