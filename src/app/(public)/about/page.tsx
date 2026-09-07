import type { Metadata } from 'next';
import PortraitAdBanner from '@/components/PortraitAdBanner';
import LiveClock from '@/components/LiveClock';
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
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About VibeStale | AI-Powered Nigerian News',
  description:
    'VibeStale is a Nigerian AI-powered news platform. We aggregate headlines from trusted sources, generate neutral AI summaries, and deliver live news, celebrity news, and in-depth updates—all in one place.',
  alternates: {
    canonical: `${process.env.NEXT_PUBLIC_APP_URL}/about`,
  },
};

export default function AboutPage() {
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibestale.com';

  const values = [
    { icon: <Shield className="w-5 h-5" />, title: 'Neutrality', description: 'AI summaries are factual and unbiased' },
    { icon: <Eye className="w-5 h-5" />, title: 'Transparency', description: 'Sources are always credited and linked' },
    { icon: <Zap className="w-5 h-5" />, title: 'Speed', description: 'Fresh headlines every few minutes' },
    { icon: <Smartphone className="w-5 h-5" />, title: 'Accessibility', description: 'Optimised for mobile and low bandwidth' },
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
                AI-Powered Platform
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3 font-space-grotesk">
                About VibeStale
              </h1>
              <p className="text-lg text-[var(--text-secondary)]">
                Understand what's happening, know why it matters.
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
              <p className="text-[var(--text-secondary)] leading-relaxed">
                VibeStale is a Nigerian news intelligence platform that combines
                real-time headlines with artificial intelligence to give you context, clarity,
                and insight. We help you stay informed about politics, business, sports,
                entertainment, technology, and more—without noise or bias.
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
                We aggregate headlines from some of Nigeria's most trusted news sources and
                use AI to generate neutral, easy-to-understand summaries. We never copy
                articles. Instead, we link directly to the original publisher so you can read
                the full story from the source.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We also provide live news channels and celebrity news updates, all in one
                modern platform.
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
                  headline, our AI generates a short analysis—covering context, key players,
                  and why it matters to Nigerians. The original source is always linked.
                </p>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  We also curate live news channels and celebrity updates using official
                  YouTube streams, so you can stay up to date without leaving the platform.
                </p>
              </div>
            </section>

            {/* Why We Built VibeStale */}
            <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
                  <Users className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] font-space-grotesk">
                  Why We Built VibeStale
                </h2>
              </div>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We believe Nigerians deserve fast, accurate, and contextual news. Traditional
                media can be slow, biased, or scattered across many websites. VibeStale
                brings everything together in one modern, mobile-friendly platform.
              </p>
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
                {[
                  {
                    q: 'Do you write your own articles?',
                    a: 'No. We aggregate headlines from trusted Nigerian publishers and use AI to provide original summaries and context. We always link to the full story.'
                  },
                  {
                    q: 'Is VibeStale free?',
                    a: 'Yes, VibeStale is free to use. In the future, we may introduce premium features, but the core news experience will remain free.'
                  },
                  {
                    q: 'How often is the news updated?',
                    a: 'News is updated continuously. Our system checks trusted sources every few minutes and adds new headlines automatically.'
                  },
                  {
                    q: 'Can I share VibeStale content?',
                    a: 'Yes! Use the share menu on any headline to share via WhatsApp, Facebook, X (Twitter), or Telegram.'
                  },
                ].map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-[var(--border)] overflow-hidden"
                  >
                    <details className="group">
                      <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--surface-hover)] transition-colors list-none">
                        <h3 className="font-semibold text-[var(--text-primary)]">
                          {faq.q}
                        </h3>
                        <ChevronDown className="w-4 h-4 text-[var(--text-tertiary)] transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="px-4 pb-4 text-[var(--text-secondary)] leading-relaxed">
                        {faq.a}
                      </p>
                    </details>
                  </div>
                ))}
              </div>
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
                For advertising, partnerships, or feedback, reach us on WhatsApp:
              </p>
              <a
                href="https://wa.me/2348038887589"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-white font-semibold rounded-xl hover:bg-[var(--accent-hover)] transition-all shadow-lg hover:shadow-xl"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp: +234 803 888 7589
              </a>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}