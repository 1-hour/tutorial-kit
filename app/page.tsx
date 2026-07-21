import type { Metadata } from 'next';
import { getSiteConfig } from '@/lib/content';

/**
 * Root page: shell page for the domain root.
 *
 * In production the Cloudflare `_redirects` file (see project root
 * `public/_redirects` in build output) intercepts `/` with a real 302 to
 * `/{defaultLocale}/` before this HTML is ever served. This page only
 * matters if that redirect misfires (e.g. local `next start` preview, or
 * accidentally served as static asset without the redirect rule).
 *
 * SEO stance:
 *   - `robots: noindex, follow` — Google should NEVER treat `/` as a
 *     standalone document. If a bot ever gets here, follow the meta refresh
 *     and don't index the shell.
 *   - No `alternates.canonical` — see the comment on `robots` above. We do
 *     not want to declare a canonical for a page that isn't supposed to
 *     exist in the index.
 *   - Not in sitemap (see `app/sitemap.ts`).
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
};

export default function RootPage() {
  const site = getSiteConfig();
  const defaultLocale = site.defaultLocale;
  const locales = site.locales;
  const defaultTarget = `/${defaultLocale}/`;

  return (
    <>
      {/* Fallback #1: no-JS clients get a hard meta refresh. */}
      <meta httpEquiv="refresh" content={`0; url=${defaultTarget}`} />

      {/* Fallback #2: with-JS clients get a locale-aware jump. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var locales = ${JSON.stringify(locales)};
              var defaultLocale = ${JSON.stringify(defaultLocale)};
              var stored = null;
              try { stored = localStorage.getItem('locale'); } catch(e) {}
              var target = defaultLocale;
              if (stored && locales.indexOf(stored) !== -1) {
                target = stored;
              } else {
                var browser = ((navigator.language || '').toLowerCase());
                for (var i = 0; i < locales.length; i++) {
                  if (browser.indexOf(locales[i]) === 0) {
                    target = locales[i];
                    break;
                  }
                }
              }
              location.replace('/' + target + '/');
            })();
          `,
        }}
      />
      {/* Fallback #3: fully broken clients still see a human-readable link. */}
      <div style={{ padding: 40, fontFamily: 'system-ui, sans-serif' }}>
        <p>
          Redirecting to <a href={defaultTarget}>{defaultTarget}</a>...
        </p>
      </div>
    </>
  );
}
