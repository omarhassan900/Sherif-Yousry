import type { Metadata } from 'next';
import { cookies } from 'next/headers'; // ✅ Import cookies
import './globals.css';
import { DirectionSync } from '@/components/DirectionSync'; // ✅ Import the sync component

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
      <body className="antialiased">
        {/* ✅ This component updates the html tag on the client after mount */}
        <DirectionSync />
        {children}
      </body>
    </html>
  );
}