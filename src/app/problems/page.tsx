import type { Metadata } from 'next';
import ProblemsPage from '@/page-components/Problems';

export const metadata: Metadata = {
  title: 'Developer Problems & Solutions | DevForge Tools',
  description: 'Solve common developer problems with our comprehensive collection of tools. JWT decoding issues, regex pattern problems, SQL formatting errors, API request debugging, and more.',
  keywords: [
    'developer problems',
    'JWT decode issues',
    'regex pattern help',
    'SQL formatting errors',
    'API request debugging',
    'JSON validation problems',
    'Base64 encoding issues',
    'cron expression errors',
    'password generator problems',
    'markdown rendering issues',
    'YAML JSON conversion errors',
    'curl command problems'
  ],
  openGraph: {
    title: 'Developer Problems & Solutions | DevForge Tools',
    description: 'Solve common developer problems with our comprehensive collection of tools. JWT decoding issues, regex pattern problems, SQL formatting errors, API request debugging, and more.',
    type: 'website',
    url: 'https://devforge.tools/problems',
    siteName: 'DevForge Tools',
    images: [
      {
        url: 'https://devforge.tools/og-problems.png',
        width: 1200,
        height: 630,
        alt: 'DevForge Tools - Developer Problems & Solutions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Developer Problems & Solutions | DevForge Tools',
    description: 'Solve common developer problems with our comprehensive collection of tools.',
    images: ['https://devforge.tools/og-problems.png'],
  },
  alternates: {
    canonical: 'https://devforge.tools/problems',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function Page() {
  return <ProblemsPage />;
}