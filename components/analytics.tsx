import Script from 'next/script';
import { getSiteConfig } from '@/lib/content';

export function Analytics() {
  const site = getSiteConfig();
  const plausible = site.analytics?.plausible;
  const ga = site.analytics?.googleAnalytics;
  const counterscale = site.analytics?.counterscale;

  return (
    <>
      {plausible && (
        <Script
          defer
          data-domain={plausible.domain}
          src={plausible.src || 'https://plausible.io/js/script.js'}
          strategy="afterInteractive"
        />
      )}
      {ga && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga.id}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${ga.id}');
            `}
          </Script>
        </>
      )}
      {counterscale && counterscale.dashboardUrl && (
        <Script id="counterscale-init" strategy="afterInteractive">
          {`
            (function() {
              window.counterscale = {
                q: [["set", "siteId", "${counterscale.siteId}"], ["trackPageview"]]
              };
            })();
          `}
        </Script>
      )}
      {counterscale && counterscale.dashboardUrl && (
        <Script
          id="counterscale-tracker"
          src={`${counterscale.dashboardUrl}/tracker.js`}
          strategy="afterInteractive"
          defer
        />
      )}
    </>
  );
}
