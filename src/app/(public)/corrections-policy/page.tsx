import type { Metadata } from 'next';
import PortraitAdBanner from '@/components/PortraitAdBanner';
import LiveClock from '@/components/LiveClock';
import Link from 'next/link';
import {
  Shield,
  AlertTriangle,
  Mail,
  CheckCircle,
  FileText,
  Clock,
  MessageCircle,
} from 'lucide-react';

export const revalidate = 3600; // ISR: regenerate every hour

export const metadata: Metadata = {
  title: 'Corrections Policy | Vibestale',
  description:
    'How Vibestale handles corrections. Our commitment to accuracy and transparency when errors are identified in our summaries or attribution.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/corrections-policy`,
  },
  openGraph: {
    title: 'Corrections Policy | Vibestale',
    description:
      'How Vibestale handles corrections. Our commitment to accuracy and transparency.',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/corrections-policy`,
    type: 'website',
    siteName: 'Vibestale',
  },
  twitter: {
    card: 'summary',
    title: 'Corrections Policy | Vibestale',
    description:
      'How Vibestale handles corrections. Our commitment to accuracy and transparency.',
  },
};

export default function CorrectionsPolicyPage() {
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
        name: 'Corrections Policy',
        item: `${baseUrl}/corrections-policy`,
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
                <AlertTriangle className="w-4 h-4" />
                Corrections
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3 font-space-grotesk">
                Corrections Policy
              </h1>
              <p className="text-[var(--text-secondary)]">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Our Commitment */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[var(--accent)]" />
                Our Commitment to Accuracy
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                At Vibestale, accuracy is not optional. Every summary we publish is generated
                to help readers understand the news — not to add noise or confusion.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We make every effort to ensure our summaries are factual, neutral, and
                correctly attributed to their original sources. However, we recognize that
                errors can happen. When they do, we correct them quickly, transparently, and
                without excuses.
              </p>
            </section>

            {/* What Counts as a Correction */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[var(--accent)]" />
                What Counts as a Correction
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                A correction is required when any of the following is inaccurate:
              </p>
              <ul className="space-y-3">
                {[
                  'A factual statement in a summary (names, dates, numbers, locations).',
                  'The source attribution (wrong publisher, wrong link, wrong author).',
                  'The headline or title of a summary.',
                  'The category or classification of a story.',
                  'A quote or claim that misrepresents the original reporting.',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-[var(--accent)] flex-shrink-0 mt-0.5" />
                    <span className="text-[var(--text-secondary)]">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed mt-4">
                Minor stylistic edits (typos, grammar, formatting) do not require a
                correction notice, but will still be fixed promptly.
              </p>
            </section>

            {/* How to Report an Error */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[var(--accent)]" />
                How to Report an Error
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                If you spot an error, please contact us right away. Include as much detail as
                possible so we can verify and correct it quickly:
              </p>
              <ul className="space-y-3">
                {[
                  'The URL of the Vibestale page where the error appears.',
                  'A description of what is incorrect.',
                  'The correct information (with a source, if possible).',
                  'Your contact information (optional — but helpful if we need to follow up).',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="text-[var(--text-secondary)]">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href="mailto:corrections@vibestale.com?subject=Correction%20request"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  corrections@vibestale.com
                </a>
                <a
                  href="https://wa.me/2348038887589?text=Correction%20request"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--surface-hover)] text-[var(--text-primary)] text-sm font-semibold rounded-lg border border-[var(--border)] hover:border-[var(--accent)] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp Us
                </a>
              </div>
            </section>

            {/* Our Correction Process */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-[var(--accent)]" />
                Our Correction Process
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Once a correction is reported, here is what happens:
              </p>
              <ol className="space-y-4">
                {[
                  {
                    title: 'Verification',
                    description:
                      'We review the report against the original source. If the error is confirmed, we proceed.',
                  },
                  {
                    title: 'Correction',
                    description:
                      'We update the summary, headline, source attribution, or category as needed. Corrections are made within 24 hours of verification.',
                  },
                  {
                    title: 'Transparency',
                    description:
                      'For factual corrections, we add a visible correction note at the bottom of the page explaining what was changed and when.',
                  },
                  {
                    title: 'Accountability',
                    description:
                      'Significant corrections are noted on our homepage for a period of time so readers are aware of the change.',
                  },
                ].map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                        {step.title}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* What We Won't Do */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[var(--accent)]" />
                What We Won&apos;t Do
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                In the interest of transparency and trust, we commit to the following:
              </p>
              <ul className="space-y-3">
                {[
                  'We will never silently delete a page to avoid acknowledging an error.',
                  'We will never remove an accurate but inconvenient fact because a source complains.',
                  'We will never allow advertisers or sponsors to influence corrections.',
                  'We will never blame our AI for errors — the standards are ours.',
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                    </span>
                    <span className="text-[var(--text-secondary)]">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Related Policies */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[var(--accent)]" />
                Related Policies
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                For more on how we work, see:
              </p>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/editorial-policy"
                    className="text-sm text-[var(--accent)] hover:underline"
                  >
                    → Editorial Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-[var(--accent)] hover:underline"
                  >
                    → Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-[var(--accent)] hover:underline"
                  >
                    → Terms of Service
                  </Link>
                </li>
              </ul>
            </section>

            {/* Contact */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[var(--accent)]" />
                Contact the Corrections Team
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                For corrections, clarifications, or any editorial concern:
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
                  WhatsApp:{' '}
                  <a
                    href="https://wa.me/2348038887589"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent)] hover:underline"
                  >
                    +234 803 888 7589
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}