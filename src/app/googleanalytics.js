'use client';

import Script from 'next/script';

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-CVGPD06Z46"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-CVGPD06Z46', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
