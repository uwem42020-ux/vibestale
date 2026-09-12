import type { Metadata } from 'next';
import PortraitAdBanner from '@/components/PortraitAdBanner';
import LiveClock from '@/components/LiveClock';
import Link from 'next/link';
import {
  BookOpen,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Bot,
} from 'lucide-react';

export const revalidate = 3600; // ISR: regenerate every hour

export const metadata: Metadata = {
  title: 'Vibestale Explains | Nigerian News, Explained',
  description:
    'Deep dives into the stories that matter. Understand how things work in Nigeria — from the naira and tax law to elections and electricity tariffs.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/explains`,
  },
  openGraph: {
    title: 'Vibestale Explains | Nigerian News, Explained',
    description:
      'Deep dives into the stories that matter. Understand how things work in Nigeria.',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/explains`,
    type: 'website',
    siteName: 'Vibestale',
  },
  twitter: {
    card: 'summary',
    title: 'Vibestale Explains | Nigerian News, Explained',
    description:
      'Deep dives into the stories that matter. Understand how things work in Nigeria.',
  },
};

export default function ExplainsPage() {
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibestale.com';

  // Breadcrumb structured data
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Explains',
        item: `${baseUrl}/explains`,
      },
    ],
  };

  // Teaser topics — these are placeholders until you publish real explainers
  const teaserTopics = [
    {
      title: 'Why is the naira moving today?',
      description: 'Understand what drives the naira and how it affects everyday Nigerians.',
      category: 'Economy',
    },
    {
      title: 'What does the new tax law actually change?',
      description: 'A plain-English breakdown of what taxpayers need to know.',
      category: 'Policy',
    },
    {
      title: 'How does Nigeria\u2019s VAT system work?',
      description: 'A simple guide to value-added tax, who pays it, and where it goes.',
      category: 'Business',
    },
    {
      title: 'How does the new electricity tariff affect households?',
      description: 'What the tariff change means for your monthly bill.',
      category: 'Policy',
    },
    {
      title: 'How Nigerian presidential elections work',
      description: 'A guide to the process, the players, and the timeline.',
      category: 'Politics',
    },
    {
      title: 'How to register a business in Nigeria',
      description: 'Step-by-step guidance for entrepreneurs and startups.',
      category: 'Business',
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="md:flex md:gap-8">
        <PortraitAdBanner />

        <div className="flex-1 min-w-0">
          <div className="md:hidden mb-4">
            <LiveClock initialTime={serverNow} />
          </div>

          {/* Hero */}
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-sm font-medium mb-4">
                <BookOpen className="w-4 h-4" />
                Explains
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3 font-space-grotesk">
                Vibestale Explains
              </h1>
              <p className="text-lg text-[var(--text-secondary)] mb-4">
                Deep dives into the stories that matter.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Not just what happened — how it works, why it matters, and what it means for
                everyday Nigerians. Our explainers break down complex topics into clear,
                useful guides you can actually use.
              </p>
            </div>
          </div>

          {/* Coming Soon Notice */}
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8 mb-8">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[var(--accent)]/10 rounded-lg flex-shrink-0">
                <Lightbulb className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Coming soon
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  We are building a library of evergreen explainers that stay useful long after
                  a news cycle ends. Here&apos;s a preview of the kinds of topics we&apos;re
                  preparing.
                </p>
              </div>
            </div>
          </div>

          {/* Teaser grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {teaserTopics.map((topic, index) => (
              <div
                key={index}
                className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5 relative overflow-hidden group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-medium rounded-full">
                    {topic.category}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2 leading-snug">
                  {topic.title}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2">
                  {topic.description}
                </p>
                <div className="mt-4 flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                  <Bot className="w-3 h-3" />
                  <span>In development</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[var(--accent)]/10 rounded-lg flex-shrink-0">
                <HelpCircle className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Have a topic you want explained?
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                  Tell us what you&apos;d like us to break down. We prioritize topics that
                  Nigerians are actively asking about.
                </p>
                <a
                  href="mailto:explains@vibestale.com?subject=Explainer%20suggestion"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
                >
                  Suggest a topic
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors"
            >
              ← Back to Headlines
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}