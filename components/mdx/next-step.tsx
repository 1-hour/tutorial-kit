import Link from 'next/link';
import { getTutorialMeta } from '@/lib/content';
import type { Locale } from '@/lib/types';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { getContentDir } from '@/lib/content';

/**
 * NextStep - recommends another tutorial.
 * Usage: <NextStep slug="ai-chatbot" />
 *
 * The locale must be passed via props (injected by the parent page).
 */
export function NextStep({ slug, locale }: { slug: string; locale: Locale }) {
  const meta = getTutorialMeta(slug);
  if (!meta) return null;

  // Try to load the title from the locale-specific MDX; fall back to English
  let title = slug;
  let description = '';

  const tryLocales: Locale[] = [locale, 'en'];
  for (const loc of tryLocales) {
    const p = path.join(getContentDir(), 'tutorials', slug, `${loc}.mdx`);
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, 'utf-8');
      const { data } = matter(raw);
      if (data.title) title = data.title as string;
      if (data.description) description = data.description as string;
      break;
    }
  }

  return (
    <Link
      href={`/${locale}/tutorials/${slug}/`}
      className="block my-4 p-4 rounded-lg border hover:border-[color:var(--primary)] hover:shadow-md transition-all not-prose"
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">→</div>
        <div className="flex-1">
          <div className="font-semibold text-base">{title}</div>
          {description && (
            <div className="text-sm text-muted-foreground mt-1 line-clamp-1">{description}</div>
          )}
        </div>
        <div className="text-xs text-muted-foreground">{meta.duration} min</div>
      </div>
    </Link>
  );
}
