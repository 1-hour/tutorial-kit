import Link from 'next/link';
import { getSiteConfig, getUIStrings } from '@/lib/content';
import type { Locale } from '@/lib/types';
import { LangSwitcher } from './lang-switcher';

export function Header({ locale }: { locale: Locale }) {
  const site = getSiteConfig();
  const ui = getUIStrings(locale);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={`/${locale}/`} className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{
                background: `linear-gradient(135deg, var(--primary) 0%, var(--primary-gradient-end) 100%)`,
              }}
            >
              1H
            </div>
            <span className="font-bold text-lg">{site.title[locale]}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href={`/${locale}/tutorials/`} className="text-muted-foreground hover:text-foreground transition-colors">
              {ui.nav.tutorials}
            </Link>
            <Link href={`/${locale}/categories/`} className="text-muted-foreground hover:text-foreground transition-colors">
              {ui.nav.categories}
            </Link>
            <Link href={`/${locale}/about/`} className="text-muted-foreground hover:text-foreground transition-colors">
              {ui.nav.about}
            </Link>
            <LangSwitcher currentLocale={locale} />
          </nav>
        </div>
      </div>
    </header>
  );
}
