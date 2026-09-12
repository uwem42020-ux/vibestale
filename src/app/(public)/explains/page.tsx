import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Metadata } from 'next';
import PortraitAdBanner from '@/components/PortraitAdBanner';
import LiveClock from '@/components/LiveClock';
import NewsletterSignup from '@/components/NewsletterSignup';
import Link from 'next/link';
import {
  BookOpen,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Bot,
  Calendar,
  Clock,
} from 'lucide-react';

export const revalidate = 3600;

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'explains');

type ExplainerMeta = {
  title: string;
  slug: string;
  category: string;
  excerpt: string;
  published_at: string;
  reading_time: string;
  author: string;
};

function getAllExplainers(): ExplainerMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith('.mdx'));
  const explainers = files.map((file) => {
    const filePath = path.join(CONTENT_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContent);
    return {
      title: data.title as string,
      slug: data.slug as string,
      category: data.category as string,
      excerpt: data.excerpt as string,
      published_at: data.published_at as string,
      reading_time: data.reading_time as string,
      author: data.author as string,
    };
  });
  return explainers.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
}

export const metadata: Metadata = {
  title: 'Vibestale Explains | Nigerian News, Explained',
  description: 'Deep dives into the stories that matter. Understand how things work in Nigeria — from the naira and tax law to elections and electricity tariffs.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_APP_URL}/explains` },
  openGraph: {
    title: 'Vibestale Explains | Nigerian News, Explained',
    description: 'Deep dives into the stories that matter. Understand how things work in Nigeria.',
    url: `${process.env.NEXT_PUBLIC_APP_URL}/explains`,
    type: 'website',
    siteName: 'Vibestale',
  },
  twitter: {
    card: 'summary',
    title: 'Vibestale Explains | Nigerian News, Explained',
    description: 'Deep dives into the stories that matter.',
  },
};

export default function ExplainsPage() {
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibestale.com';
  const explainers = getAllExplainers();

  const teaserTopics = [
    { title: 'Why is the naira moving today?', description: 'Understand what drives the naira and how it affects everyday Nigerians.', category: 'Economy' },
    { title: 'What does the new tax law actually change?', description: 'A plain-English breakdown of what taxpayers need to know.', category: 'Policy' },
    { title: 'How does Nigeria\u2019s VAT system work?', description: 'A simple guide to value-added tax, who pays it, and where it goes.', category: 'Business' },
    { title: 'How does the new electricity tariff affect households?', description: 'What the tariff change means for your monthly bill.', category: 'Policy' },
    { title: 'How Nigerian presidential elections work', description: 'A guide to the process, the players, and the timeline.', category: 'Politics' },
  ];

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Explains', item: `${baseUrl}/explains` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="md:flex md:gap-8">
        <PortraitAdBanner />
        <div className="flex-1 min-w-0">
          <div className="md:hidden mb-4">
            <LiveClock initialTime={serverNow} />
          </div>

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
                Not just what happened — how it works, why it matters, and what it means for everyday Nigerians. Our explainers break down complex topics into clear, useful guides you can actually use.
              </p>
            </div>
          </div>

          {explainers.length > 0 ? (
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
                  <BookOpen className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] font-space-grotesk">
                  Latest Explainers
                </h2>
                <span className="text-sm text-[var(--text-tertiary)] ml-auto">
                  {explainers.length} {explainers.length === 1 ? 'article' : 'articles'}
                </span>
              </div>
              <div className="space-y-4">
                {explainers.map((explainer) => (
                  <Link key={explainer.slug} href={`/explains/${explainer.slug}`} className="block bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5 hover:border-[var(--accent)]/40 hover:shadow-lg transition-all group">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2.5 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-semibold rounded-full">
                        {explainer.category}
                      </span>
                      <span className="text-xs text-[var(--text-tertiary)] inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(explainer.published_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="text-xs text-[var(--text-tertiary)] inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {explainer.reading_time}
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors leading-snug font-space-grotesk">
                      {explainer.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-2 mb-3">
                      {explainer.excerpt}
                    </p>
                    <div className="flex items-center gap-1 text-sm font-semibold text-[var(--accent)]">
                      Read explainer
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : (
            <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8 mb-8">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-[var(--accent)]/10 rounded-lg flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                    No explainers published yet
                  </h2>
                  <p className="text-[var(--text-secondary)] leading-relaxed">
                    Our first explainers are in development. Check back soon — or subscribe below to be notified when they go live.
                  </p>
                </div>
              </div>
            </div>
          )}

          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-[var(--accent)]/10 rounded-lg">
                <Lightbulb className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)] font-space-grotesk">
                Coming Soon
              </h2>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
              A preview of the explainers we&apos;re preparing. Each one will stay useful long after the news cycle ends.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teaserTopics.map((topic, index) => (
                <div key={index} className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5 relative overflow-hidden opacity-90">
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
          </section>

          <section className="mb-8">
            <NewsletterSignup />
          </section>

          <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-[var(--accent)]/10 rounded-lg flex-shrink-0">
                <HelpCircle className="w-5 h-5 text-[var(--accent)]" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                  Have a topic you want explained?
                </h2>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
                  Tell us what you&apos;d like us to break down. We prioritize topics that Nigerians are actively asking about.
                </p>
                <a href="mailto:explains@vibestale.com?subject=Explainer%20suggestion" className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors">
                  Suggest a topic
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </section>

          <div className="mt-8">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors">
              ← Back to Headlines
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
