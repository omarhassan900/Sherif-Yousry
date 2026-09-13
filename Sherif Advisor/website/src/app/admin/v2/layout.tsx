import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Portal v2 | Sherif Yousry Advisory',
  description: 'Content Management System for Sherif Yousry Advisory (v2)',
  robots: { index: false, follow: false },
};

export default function AdminV2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
