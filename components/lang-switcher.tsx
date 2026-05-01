'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import type { Locale } from '@/lib/types';

const LOCALE_LABELS: Record<Locale, string> = {
  en: 'English',
  zh: '中文',
};

const AVAILABLE_LOCALES: Locale[] = ['en', 'zh'];

export function LangSwitcher({ currentLocale }: { currentLocale: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const switchTo = (locale: Locale) => {
    try {
      localStorage.setItem('locale', locale);
    } catch (e) {}
    // Replace /<currentLocale>/ with /<newLocale>/
    let newPath = pathname;
    if (pathname.startsWith(`/${currentLocale}/`)) {
      newPath = pathname.replace(`/${currentLocale}/`, `/${locale}/`);
    } else if (pathname === `/${currentLocale}`) {
      newPath = `/${locale}/`;
    }
    router.push(newPath);
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        🌐 {currentLocale.toUpperCase()}
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-40 bg-background border rounded-lg shadow-lg overflow-hidden">
          {AVAILABLE_LOCALES.map((loc) => (
            <button
              key={loc}
              onClick={() => switchTo(loc)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                loc === currentLocale ? 'font-medium text-[color:var(--primary)]' : ''
              }`}
            >
              {loc === currentLocale ? '✓ ' : '   '}
              {LOCALE_LABELS[loc]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
