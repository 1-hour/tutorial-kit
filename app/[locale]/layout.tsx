import type { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { getSiteConfig, getLocales, isValidLocale } from '@/lib/content';
import type { Locale } from '@/lib/types';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return getLocales().map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const site = getSiteConfig();
  if (!isValidLocale(locale)) return {};

  const loc = locale as Locale;
  const alternates: Record<string, string> = {};
  for (const l of site.locales) {
    alternates[l] = `${site.url}/${l}/`;
  }

  return {
    metadataBase: new URL(site.url),
    title: {
      default: site.title[loc],
      template: `%s — ${site.title[loc]}`,
    },
    description: site.description[loc],
    alternates: {
      canonical: `/${loc}/`,
      languages: alternates,
      types: {
        'application/rss+xml': `/${loc}/rss.xml`,
      },
    },
    openGraph: {
      title: site.title[loc],
      description: site.description[loc],
      url: `${site.url}/${loc}/`,
      siteName: site.title[loc],
      locale: loc === 'zh' ? 'zh_CN' : 'en_US',
      type: 'website',
      images: site.social?.ogImage ? [{ url: site.social.ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: (site.social?.twitterCard as 'summary_large_image' | 'summary') || 'summary_large_image',
      title: site.title[loc],
      description: site.description[loc],
      creator: site.author.twitter ? `@${site.author.twitter}` : undefined,
      images: site.social?.ogImage ? [site.social.ogImage] : undefined,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) {
    notFound();
  }
  const loc = locale as Locale;

  return (
    <>
      <Header locale={loc} />
      <main className="min-h-[calc(100vh-8rem)]">{children}</main>
      <Footer locale={loc} />
    </>
  );
}
