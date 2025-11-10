import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AssureSphere | Intelligent Insurance Broking Platform',
  description:
    'AssureSphere is an AI-powered insurance broking platform for intermediaries featuring no-code customization, intelligent automation, and end-to-end client engagement.',
  keywords: [
    'insurance broking',
    'no-code insurance platform',
    'policy management',
    'claims automation',
    'AI insurance tools'
  ]
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="theme-light">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
