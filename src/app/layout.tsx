import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  applicationName: '스마트학생복',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: '스마트학생복', statusBarStyle: 'default' },
  icons: { icon: [{ url: '/icons/app-32.png', sizes: '32x32', type: 'image/png' }], apple: [{ url: '/icons/app-180.png', sizes: '180x180', type: 'image/png' }] },
  title: '스마트학생복 춘천점',
  description: '스마트 학생복 셀프 주문/예약 시스템',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#e11d48',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
      </head>
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1a2e',
              color: '#fff',
              borderRadius: '12px',
              fontSize: '14px',
              padding: '12px 16px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#e11d48', secondary: '#fff' } },
          }}
        />
      </body>
    </html>
  );
}
