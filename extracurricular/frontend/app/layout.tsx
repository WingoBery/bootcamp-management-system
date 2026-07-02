import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bootcamp Management System',
  description: 'Student, supervisor, and admin dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
