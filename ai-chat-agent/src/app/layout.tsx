/**
 * @description Root layout for the application
 * Sets up global styles, fonts, and providers
 */

import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

/**
 * @description Inter font configuration
 */
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

/**
 * @description Application metadata for SEO
 */
export const metadata: Metadata = {
  title: 'SPAN AI Agent - Your Intelligent Assistant',
  description: 'A modern AI-powered chat interface supporting text, voice, images, and files.',
  keywords: ['AI', 'chat', 'assistant', 'voice', 'image upload'],
  authors: [{ name: 'SPAN AI Agent Team' }],
};

/**
 * @description Viewport configuration
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0f0f23',
};

/**
 * @description Root layout component
 * Wraps all pages with global providers and styles
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        {children}
      </body>
    </html>
  );
}
