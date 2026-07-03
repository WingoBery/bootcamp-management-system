import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '../components/ThemeProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Bootcamp Management',
  description: 'Bootcamp scheduling, enrollment, and project reviews',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
