import Script from 'next/script'

/**
 * Privacy-friendly analytics, controlled entirely by environment variables.
 * Nothing loads unless you set one of these in your hosting dashboard:
 *
 *   NEXT_PUBLIC_GA_ID            e.g. "G-XXXXXXXXXX"   (Google Analytics 4 — free)
 *   NEXT_PUBLIC_PLAUSIBLE_DOMAIN e.g. "dallaslights.com" (Plausible — paid, no cookie banner)
 *
 * You only need ONE. If both are set, both load.
 */
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN

  return (
    <>
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${gaId}');
            `}
          </Script>
        </>
      )}

      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
    </>
  )
}
