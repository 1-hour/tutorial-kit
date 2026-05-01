import { getSiteConfig } from '@/lib/content';

/**
 * Root page: client-side redirect to a locale.
 * Static export-friendly (no server redirect).
 */
export default function RootPage() {
  const site = getSiteConfig();
  const defaultLocale = site.defaultLocale;
  const locales = site.locales;

  return (
    <>
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
      <noscript>
        <meta httpEquiv="refresh" content={`0; url=/${defaultLocale}/`} />
      </noscript>
      <div style={{ padding: 40, fontFamily: 'system-ui, sans-serif' }}>
        <p>
          Redirecting to{' '}
          <a href={`/${defaultLocale}/`}>/{defaultLocale}/</a>
          ...
        </p>
      </div>
    </>
  );
}
