import type { Metadata } from 'next';
import PortraitAdBanner from '@/components/PortraitAdBanner';
import LiveClock from '@/components/LiveClock';
import NewsletterSignup from '@/components/NewsletterSignup';
import Link from 'next/link';
import {
  Newspaper,
  Zap,
  Shield,
  Eye,
  Smartphone,
  MessageCircle,
  ChevronDown,
  Bot,
  Globe,
  Users,
  Target,
  BookOpen,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Link2,
} from 'lucide-react';

export const revalidate = 3600; // ISR: regenerate every hour

export const metadata: Metadata = {
  title: 'About Vibestale | Nigerian News, Explained',
  description:
    'Vibestale is a Nigerian news intelligence platform. We combine trusted headlines with AI-powered summaries and context so you understand what is happening — not just what happened.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/about`,
  },
  openGraph: {
    title: 'About Vibestale | Nigerian News, Explained',
    description:
      'Vibestale is a Nigerian news intelligence platform. Understand what is happening — not just what happened.',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/about`,
    type: 'website',
    siteName: 'Vibestale',
  },
  twitter: {
    card: 'summary',
    title: 'About Vibestale | Nigerian News, Explained',
    description:
      'Vibestale is a Nigerian news intelligence platform. Understand what is happening — not just what happened.',
  },
};

export default function AboutPage() {
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibestale.com';

  const values = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Neutrality',
      description: 'AI summaries are factual and unbiased',
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: 'Transparency',
      description: 'Sources are always credited and linked',
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: 'Speed',
      description: 'Fresh headlines every few minutes',
    },
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: 'Accessibility',
      description: 'Optimized for mobile and low bandwidth',
    },
  ];

  const principles = [
    {
      icon: <Bot className="w-5 h-5" />,
      title: 'AI is our engine, not our voice',
      description:
        'We use AI to summarize and add context. We do not use AI to invent news or publish unverified claims. Every story is based on real reporting from a real publisher.',
    },
    {
      icon: <Link2 className="w-5 h-5" />,
      title: 'Attribution first',
      description:
        'Every summary credits the original publisher and links to the full story. We never claim ownership of third-party reporting.',
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: 'Quality over quantity',
      description:
        'We would rather publish 30 genuinely useful stories than 300 low-value rewrites. Every headline must add value — context, clarity, or relevance.',
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: 'Accountability',
      description:
        'When we make a mistake, we correct it quickly and transparently. Our corrections policy is published and public.',
    },
  ];

  const faqs = [
    {
      q: 'Do you write your own articles?',
      a: 'No. We aggregate headlines from trusted Nigerian publishers and use AI to generate original summaries and context. We always link to the full story so readers can access the original reporting.',
    },
    {
      q: 'Is Vibestale free?',
      a: 'Yes, Vibestale is completely free. In the future we may introduce premium features, but the core news experience will always remain free.',
    },
    {
      q: 'How often is the news updated?',
      a: 'Continuously. Our system checks trusted sources every few minutes and adds new headlines automatically. Breaking news is prioritized and surfaced across the site.',
    },
    {
      q: 'Is AI writing the news?',
      a: 'No. AI summarizes and adds context to real articles written by real journalists. We do not use AI to invent news, conduct interviews, or publish unverified claims.',
    },
    {
      q: 'Can I share Vibestale content?',
      a: 'Yes! Use the share menu on any headline to share via WhatsApp, Facebook, X (Twitter), or Telegram. Each headline page has a permanent shareable link.',
    },
    {
      q: 'How do you handle errors?',
      a: 'We correct errors quickly and transparently. Every correction is logged, and readers can report errors at corrections@vibestale.com. See our Corrections Policy for full details.',
    },
    {
      q: 'Do you have an app?',
      a: 'Not yet, but Vibestale is fully optimized for mobile and low-bandwidth networks. It works fast on any smartphone.',
    },
    {
      q: 'How can I advertise or partner with you?',
      a: 'Reach out to us on WhatsApp at +234 803 888 7589 or email partners@vibestale.com. We offer display ads, sponsored placements, and brand partnerships.',
    },
  ];

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
        name: 'About',
        item: `${baseUrl}/about`,
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

          {/* Hero Section */}
          <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-8 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)]/5 rounded-full blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-sm font-medium mb-4">
                <Bot className="w-4 h-4" />
                Nigerian News, Explained
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3 font-space-grotesk">
                About Vibestale
              </h1>
              <p className="text-lg text-[var(--text-secondary)] mb-4">
                Understand what&apos;s happening — not just what happened.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Vibestale is a Nigerian news intelligence platform that combines trusted
                headlines with artificial intelligence to help you understand the news, not
                just read it. We surface what matters, explain why it matters, and always
                credit the original reporting.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {/* Who We Are */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
                  <Globe className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] font-space-grotesk">
                  Who We Are
                </h2>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We are a modern Nigerian digital media company using technology to make news
                easier to understand. We are not trying to be the biggest newsroom in Nigeria.
                We are trying to be the clearest.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Every day, thousands of stories are published across Nigeria and the world.
                Most readers don&apos;t have time to sift through them all. Vibestale brings
                the important ones together, adds context, and helps you understand what
                actually matters — all in one place.
              </p>
            </section>

            {/* What We Do */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
                  <Newspaper className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] font-space-grotesk">
                  What We Do
                </h2>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We aggregate headlines from some of Nigeria&apos;s most trusted news sources
                and use AI to generate neutral, easy-to-understand summaries. We never copy
                articles. Instead, we link directly to the original publisher so you can read
                the full story from the source.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We also provide live news channels, celebrity news, and — coming soon —
                in-depth explainers that break down complex topics like the naira, tax law,
                and elections into clear, useful guides.
              </p>
            </section>

            {/* How It Works */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
                  <Target className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] font-space-grotesk">
                  How It Works
                </h2>
              </div>
              <div className="space-y-4">
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Our system automatically fetches headlines from trusted RSS feeds. For each
                  headline, our AI generates a short analysis — covering context, key players,
                  and why it matters to Nigerians. The original source is always linked.
                </p>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  We also curate live news channels and celebrity updates using official
                  YouTube streams, so you can stay up to date without leaving the platform.
                </p>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  Every summary is attributed, and every story links back to the publisher.
                  Our goal is not to replace the original reporting — it&apos;s to help you
                  understand it faster.
                </p>
              </div>
            </section>

            {/* Why We Built Vibestale */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
                  <Users className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] font-space-grotesk">
                  Why We Built Vibestale
                </h2>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                We believe Nigerians deserve fast, accurate, and contextual news. Traditional
                media can be slow, biased, or scattered across too many websites. Readers are
                left to piece together what&apos;s happening on their own.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Vibestale brings everything together in one modern, mobile-friendly platform —
                and adds the context that helps you actually understand the story.
              </p>
            </section>

            {/* Our Principles */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] font-space-grotesk">
                  Our Principles
                </h2>
              </div>
              <div className="space-y-4">
                {principles.map((principle, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-xl bg-[var(--surface-hover)]"
                  >
                    <div className="text-[var(--accent)] mt-0.5 flex-shrink-0">
                      {principle.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                        {principle.title}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Our Values */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
                  <Shield className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] font-space-grotesk">
                  Our Values
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 rounded-xl bg-[var(--surface-hover)]"
                  >
                    <div className="text-[var(--accent)] mt-1">{value.icon}</div>
                    <div>
                      <h3 className="font-semibold text-[var(--text-primary)] mb-1">
                        {value.title}
                      </h3>
                      <p className="text-sm text-[var(--text-tertiary)]">{value.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Vibestale Explains */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
                  <BookOpen className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] font-space-grotesk">
                  Vibestale Explains
                </h2>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                Beyond daily news, we are building a library of evergreen explainers — clear
                guides on how things actually work in Nigeria. From the naira to tax law to
                elections, these articles stay useful long after the news cycle ends.
              </p>
              <Link
                href="/explains"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline"
              >
                Explore Vibestale Explains →
              </Link>
            </section>

            {/* FAQ */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] font-space-grotesk">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-[var(--border)] overflow-hidden"
                  >
                    <details className="group">
                      <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors list-none">
                        <h3 className="font-semibold text-[var(--text-primary)] text-sm sm:text-base">
                          {faq.q}
                        </h3>
                        <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)] transition-transform group-open:rotate-180 flex-shrink-0 ml-3" />
                      </summary>
                      <p className="px-4 pb-4 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                        {faq.a}
                      </p>
                    </details>
                  </div>
                ))}
              </div>
            </section>

            {/* Newsletter */}
            <section>
              <NewsletterSignup />
            </section>

            {/* Contact Us */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] font-space-grotesk">
                  Contact Us
                </h2>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                For advertising, partnerships, corrections, or feedback:
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/2348038887589"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-all shadow-lg hover:shadow-xl"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp: +234 803 888 7589
                </a>
                <a
                  href="mailto:info@vibestale.com"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[var(--surface-hover)] text-[var(--text-primary)] font-semibold rounded-xl border border-[var(--border)] hover:border-[var(--accent)] transition-all"
                >
                  info@vibestale.com
                </a>
              </div>

              {/* Related pages */}
              <div className="mt-6 pt-6 border-t border-[var(--border)]">
                <p className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
                  Related
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/editorial-policy"
                    className="px-3 py-1.5 bg-[var(--surface-hover)] text-xs font-medium text-[var(--text-secondary)] rounded-full border border-[var(--border)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                  >
                    Editorial Policy
                  </Link>
                  <Link
                    href="/corrections-policy"
                    className="px-3 py-1.5 bg-[var(--surface-hover)] text-xs font-medium text-[var(--text-secondary)] rounded-full border border-[var(--border)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                  >
                    Corrections Policy
                  </Link>
                  <Link
                    href="/privacy"
                    className="px-3 py-1.5 bg-[var(--surface-hover)] text-xs font-medium text-[var(--text-secondary)] rounded-full border border-[var(--border)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="px-3 py-1.5 bg-[var(--surface-hover)] text-xs font-medium text-[var(--text-secondary)] rounded-full border border-[var(--border)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors"
                  >
                    Terms of Service
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}