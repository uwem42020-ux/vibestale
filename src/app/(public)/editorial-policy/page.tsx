import type { Metadata } from 'next';
import PortraitAdBanner from '@/components/PortraitAdBanner';
import LiveClock from '@/components/LiveClock';
import Link from 'next/link';
import {
  Shield,
  FileText,
  Bot,
  Link2,
  AlertTriangle,
  Mail,
  CheckCircle,
  Newspaper,
  Users,
} from 'lucide-react';

export const revalidate = 3600; // ISR: regenerate every hour

export const metadata: Metadata = {
  title: 'Editorial Policy | Vibestale',
  description:
    'How Vibestale selects stories, attributes sources, uses AI, and handles corrections. Our commitment to transparency, accuracy, and trust.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/editorial-policy`,
  },
  openGraph: {
    title: 'Editorial Policy | Vibestale',
    description:
      'How Vibestale selects stories, attributes sources, uses AI, and handles corrections.',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/editorial-policy`,
    type: 'website',
    siteName: 'Vibestale',
  },
  twitter: {
    card: 'summary',
    title: 'Editorial Policy | Vibestale',
    description:
      'How Vibestale selects stories, attributes sources, uses AI, and handles corrections.',
  },
};

export default function EditorialPolicyPage() {
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
  const lastUpdated = 'January 1, 2025';
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
        name: 'Editorial Policy',
        item: `${baseUrl}/editorial-policy`,
      },
    ],
  };

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

          {/* Header */}
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-sm font-medium mb-4">
                <Shield className="w-4 h-4" />
                Editorial Standards
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3 font-space-grotesk">
                Editorial Policy
              </h1>
              <p className="text-[var(--text-secondary)]">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Introduction */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--accent)]" />
                Our Commitment
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Vibestale is a Nigerian digital news intelligence platform. Our mission is simple:
                help people understand what is happening — not just what happened.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We aggregate headlines from trusted Nigerian and international publishers and use
                AI to generate neutral summaries and context. We never claim to be the original
                source of any news story. Instead, we link directly to the publisher and add value
                through clarity, structure, and context.
              </p>
            </section>

            {/* How We Select Stories */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Newspaper className="w-5 h-5 text-[var(--accent)]" />
                How We Select Stories
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Every headline on Vibestale must meet at least one of these criteria:
              </p>
              <ul className="space-y-3">
                {[
                  'It is a breaking or developing story relevant to Nigerians.',
                  'It has significant impact on the public (policy, economy, security).',
                  'It provides meaningful context that helps readers understand ongoing events.',
                  'It comes from a credible, verifiable source.',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--text-secondary)]">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed mt-4">
                We do not publish rumours, unverified claims, or stories designed purely for
                clicks. Quality matters more than volume.
              </p>
            </section>

            {/* Source Attribution */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-[var(--accent)]" />
                Source Attribution
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Attribution is central to how we operate. Every headline page on Vibestale includes:
              </p>
              <ul className="space-y-3">
                {[
                  'The name of the original publisher.',
                  'A direct link to the original article.',
                  'The publication date and time.',
                  'A clear distinction between the original reporting and Vibestale analysis.',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--text-secondary)]">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed mt-4">
                We never copy full articles. Our summaries are original, AI-assisted, and
                human-reviewed for clarity and neutrality.
              </p>
            </section>

            {/* AI Usage */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Bot className="w-5 h-5 text-[var(--accent)]" />
                How We Use AI
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                AI is the engine behind Vibestale — not the voice. We use it to:
              </p>
              <ul className="space-y-3">
                {[
                  'Summarize headlines into clear, neutral language.',
                  'Add context on why a story matters.',
                  'Identify affected parties and likely next steps.',
                  'Categorize and organize stories by topic.',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--text-secondary)]">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-lg p-4 mt-4">
                <p className="text-[var(--text-secondary)] leading-relaxed text-sm">
                  <strong className="text-[var(--text-primary)]">Important:</strong> Vibestale
                  does not generate original news reporting. We do not interview sources, and we
                  do not publish AI-generated claims about events that did not happen. Every
                  headline we publish is based on a real article from a real publisher.
                </p>
              </div>
            </section>

            {/* Corrections */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[var(--accent)]" />
                Corrections Policy
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Accuracy is critical. If we discover an error in a summary or attribution, we
                correct it promptly. Corrections follow these steps:
              </p>
              <ol className="space-y-3">
                {[
                  'The error is identified and verified.',
                  'The summary is corrected within 24 hours of confirmation.',
                  'A note is added to the article indicating the correction.',
                  'Significant corrections are noted on our homepage.',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-[var(--text-secondary)]">{item}</span>
                  </li>
                ))}
              </ol>
              <p className="text-[var(--text-secondary)] leading-relaxed mt-4">
                To report an error, contact us at{' '}
                <a
                  href="mailto:corrections@vibestale.com"
                  className="text-[var(--accent)] hover:underline"
                >
                  corrections@vibestale.com
                </a>
                .
              </p>
            </section>

            {/* Sponsored Content */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--accent)]" />
                Sponsored Content
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Any sponsored or branded content on Vibestale is clearly labelled as such.
                Sponsored content is never mixed with editorial news and does not influence our
                headline selection. Advertisers cannot pay to remove, alter, or prioritize
                editorial stories.
              </p>
            </section>

            {/* Independence */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[var(--accent)]" />
                Editorial Independence
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Vibestale maintains editorial independence from advertisers, sponsors, and
                external partners. Our news selection, summaries, and context are driven by
                public interest, not commercial interests.
              </p>
            </section>

            {/* Contact */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[var(--accent)]" />
                Contact the Editorial Team
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                For questions about our editorial standards, or to report an issue:
              </p>
              <div className="space-y-2">
                <p className="text-[var(--text-secondary)]">
                  Corrections:{' '}
                  <a
                    href="mailto:corrections@vibestale.com"
                    className="text-[var(--accent)] hover:underline"
                  >
                    corrections@vibestale.com
                  </a>
                </p>
                <p className="text-[var(--text-secondary)]">
                  Editorial:{' '}
                  <a
                    href="mailto:editorial@vibestale.com"
                    className="text-[var(--accent)] hover:underline"
                  >
                    editorial@vibestale.com
                  </a>
                </p>
                <p className="text-[var(--text-secondary)]">
                  Partnerships:{' '}
                  <a
                    href="mailto:partners@vibestale.com"
                    className="text-[var(--accent)] hover:underline"
                  >
                    partners@vibestale.com
                  </a>
                </p>
              </div>
              <div className="mt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
                >
                  Learn more about Vibestale
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}