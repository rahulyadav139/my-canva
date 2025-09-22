import './globals.css';
import '@repo/ui/styles.css';

import { Source_Sans_3, Source_Serif_4 } from 'next/font/google';

import { Toaster } from '@repo/ui/base/toast';

const sourceSerif4 = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin'],
});

const sourceSans3 = Source_Sans_3({
  variable: '--font-source-sans',
  subsets: ['latin'],
});

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        className={`${sourceSerif4.variable} ${sourceSans3.variable} antialiased`}
      >
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}
