import { getAllTutorials, getSiteConfig } from '@/lib/content';
import type { Locale } from '@/lib/types';

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid: string;
}

function generateRSS(locale: Locale): string {
  const site = getSiteConfig();
  const baseUrl = site.url.replace(/\/$/, '');
  const tutorials = getAllTutorials(locale);

  const items: RSSItem[] = tutorials.map((t) => ({
    title: t.title,
    description: t.description,
    link: `${baseUrl}/${locale}/tutorials/${t.slug}/`,
    pubDate: new Date(t.date).toUTCString(),
    guid: `${baseUrl}/${locale}/tutorials/${t.slug}/`,
  }));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${site.title[locale]}]]></title>
    <description><![CDATA[${site.description[locale]}]]></description>
    <link>${baseUrl}/</link>
    <atom:link href="${baseUrl}/${locale}/rss.xml" rel="self" type="application/rss+xml" />
    <language>${locale === 'zh' ? 'zh-CN' : 'en-US'}</language>
    ${items
      .map(
        (item) => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <guid>${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
    </item>`
      )
      .join('\n')}
  </channel>
</rss>`;

  return xml;
}

export const dynamic = 'force-static';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }];
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const rss = generateRSS(locale as Locale);
  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
