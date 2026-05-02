import { getAllTutorials, getSiteConfig } from '@/lib/content';

export const dynamic = 'force-static';

interface SearchIndexItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  difficulty: string;
  duration: number;
  locale: string;
  url: string;
}

export async function GET() {
  const site = getSiteConfig();
  const baseUrl = site.url.replace(/\/$/, '');
  const index: SearchIndexItem[] = [];

  for (const locale of site.locales) {
    const tutorials = getAllTutorials(locale);
    for (const t of tutorials) {
      index.push({
        slug: t.slug,
        title: t.title,
        description: t.description,
        category: t.category,
        tags: t.tags,
        difficulty: t.difficulty,
        duration: t.duration,
        locale,
        url: `${baseUrl}/${locale}/tutorials/${t.slug}/`,
      });
    }
  }

  return new Response(JSON.stringify(index), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
