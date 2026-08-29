import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Portal | Sherif Yousry Advisory',
  description: 'Content Management System for Sherif Yousry Advisory',
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
