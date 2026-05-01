import Link from 'next/link';
import { getSiteConfig, getUIStrings } from '@/lib/content';
import type { Locale } from '@/lib/types';

export function Footer({ locale }: { locale: Locale }) {
  const site = getSiteConfig();
  const ui = getUIStrings(locale);

  return (
    <footer className="border-t mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{
                  background: `linear-gradient(135deg, var(--primary) 0%, var(--primary-gradient-end) 100%)`,
                }}
              >
                1H
              </div>
              <span className="font-bold">{site.title[locale]}</span>
            </div>
            <p className="text-sm text-muted-foreground">{ui.footer.tagline}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">{ui.footer.learn}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href={`/${locale}/tutorials/`} className="hover:text-foreground">{ui.nav.tutorials}</Link></li>
              <li><Link href={`/${locale}/categories/`} className="hover:text-foreground">{ui.nav.categories}</Link></li>
              <li><Link href={`/${locale}/about/`} className="hover:text-foreground">{ui.nav.about}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">{ui.footer.community}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {site.author.github && (
                <li><a href={`https://github.com/${site.author.github}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">GitHub</a></li>
              )}
              {site.author.twitter && (
                <li><a href={`https://twitter.com/${site.author.twitter}`} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Twitter</a></li>
              )}
              {site.author.email && (
                <li><a href={`mailto:${site.author.email}`} className="hover:text-foreground">Email</a></li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">{site.author.name}</h4>
            <p className="text-sm text-muted-foreground">
              {site.author.url && (
                <a href={site.author.url} className="hover:text-foreground" target="_blank" rel="noopener noreferrer">
                  {site.author.url.replace(/^https?:\/\//, '')}
                </a>
              )}
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {site.title[locale]}. {ui.footer.built_by}{' '}
          {site.author.url ? (
            <a href={site.author.url} className="text-[color:var(--primary)] hover:underline" target="_blank" rel="noopener noreferrer">
              {site.author.name}
            </a>
          ) : (
            site.author.name
          )}
          .
        </div>
      </div>
    </footer>
  );
}
