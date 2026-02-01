import type { Metadata } from 'next';
import { Inter, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['600', '700', '800'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Food Finder',
    default: 'Food Finder - Tìm Quán Ăn Ngon Đà Nẵng',
  },
  description: 'Khám phá quán ăn, cafe, địa điểm vui chơi tại Đà Nẵng. Review chân thực, bản đồ trực quan.',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Food Finder',
  },
};

import { AuthProvider } from '@/components/providers/auth-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
