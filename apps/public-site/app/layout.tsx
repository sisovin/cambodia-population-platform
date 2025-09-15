// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Battambang } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });
const battambang = Battambang({
  weight: ['400', '700'],
  subsets: ['khmer'],
  variable: '--font-battambang'
});

export const metadata: Metadata = {
  title: 'Cambodia Population Management System',
  description: 'Official platform for population management services in Cambodia',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} ${battambang.variable}`}>
      <body className="font-sans">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}