import type { Metadata } from 'next';
import { cookies } from 'next/headers'; // ✅ Import cookies
import './globals.css';
import { DirectionSync } from '@/components/DirectionSync'; // ✅ Import the sync component
import { PageViewTracker } from '@/components/PageViewTracker';

export const metadata: Metadata = {
  title: 'Sherif Yousry Advisory | استشارات شريف يسري',
  description:
    'Integrated advisory services for companies planning ahead — Tax, Finance, Risk & Business Management across Egypt, Saudi Arabia, and UAE.',
  keywords: [
    'tax advisory',
    'finance consulting',
    'Egypt',
    'Saudi Arabia',
    'UAE',
    'MENA',
    'corporate tax',
    'VAT',
    'risk management',
    'business advisory',
  ],
  authors: [{ name: 'Sherif Yousry Advisory' }],
  openGraph: {
    title: 'Sherif Yousry Advisory',
    description: 'Integrated advisory services for companies planning ahead.',
    type: 'website',
    locale: 'ar_EG',
    alternateLocale: 'en_US',
  },
   // ✅ Add the icons property here
  icons: {
    icon: '/logo.ico', // Standard favicon (put this in your `public` folder)
    shortcut: '/images/logo.png',
    apple: '/logo.png', // For Apple devices
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Try to read language from cookie on the server for the initial render
  // Fallback to 'ar' if no cookie is found
  const cookieStore = cookies();
  const langCookie = cookieStore.get('lang')?.value;
  const initialLang = (langCookie === 'en' || langCookie === 'ar') ? langCookie : 'ar';
  const initialDir = initialLang === 'ar' ? 'rtl' : 'ltr';

  return (
    <html 
      lang={initialLang} 
      dir={initialDir} 
      suppressHydrationWarning // ✅ Prevents hydration warnings when client syncs
    >
      <head>
        {/* Load web fonts here (not via a CSS @import placed after @tailwind,
            which browsers ignore). This guarantees Arabic (El Messiri / Amiri)
            and Latin (Cormorant Garamond) display faces actually download. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Aref+Ruqaa:wght@400;700&family=El+Messiri:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;500&family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {/* ✅ This component updates the html tag on the client after mount */}
        <DirectionSync />
        {/* Cookieless first-party page-view tracking (public pages only) */}
        <PageViewTracker />
        {children}
      </body>
    </html>
  );
}