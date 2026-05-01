/**
 * i18n path helpers (client-safe)
 */

import type { Locale } from './types';

const SUPPORTED_LOCALES: Locale[] = ['en', 'zh'];

/**
 * Build localized path
 */
export function localizedPath(locale: Locale, path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${locale}/${cleanPath}`;
}

/**
 * Switch locale in a path
 * Example: /en/tutorials/python-basics -> /zh/tutorials/python-basics
 */
export function switchLocaleInPath(currentPath: string, newLocale: Locale): string {
  for (const loc of SUPPORTED_LOCALES) {
    if (currentPath.startsWith(`/${loc}/`)) {
      return currentPath.replace(`/${loc}/`, `/${newLocale}/`);
    }
    if (currentPath === `/${loc}`) {
      return `/${newLocale}/`;
    }
  }
  return `/${newLocale}${currentPath.startsWith('/') ? currentPath : '/' + currentPath}`;
}
