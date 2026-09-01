import type { Metadata } from 'next';
import './globals.css';

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
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
