import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import PortraitAdBanner from '@/components/PortraitAdBanner';
import LiveClock from '@/components/LiveClock';
import NewsletterSignup from '@/components/NewsletterSignup';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArrowLeft, Calendar, Clock, BookOpen } from 'lucide-react';

const CONTENT_DIR = path.join(process.cwd(), 'src', 'content', 'explains');

type Props = {
  params: Promise<{ slug: string }>;
};

function getExplainer(slug: string) {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  return {
    frontmatter: {
      title: data.title as string,
      slug: data.slug as string,
      category: data.category as string,
      excerpt: data.excerpt as string,
      published_at: data.published_at as string,
      reading_time: data.reading_time as string,
      author: data.author as string,
    },
    content,
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const explainer = getExplainer(slug);

  if (!explainer) return { title: 'Not Found' };

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibestale.com';
  const fullUrl = `${baseUrl}/explains/${explainer.frontmatter.slug}`;

  return {
    title: `${explainer.frontmatter.title} | Vibestale Explains`,
    description: explainer.frontmatter.excerpt,
    alternates: { canonical: fullUrl },
    openGraph: {
      title: explainer.frontmatter.title,
      description: explainer.frontmatter.excerpt,
      url: fullUrl,
      type: 'article',
      siteName: 'Vibestale',
      publishedTime: explainer.frontmatter.published_at,
      images: [{ url: `${baseUrl}/blacklogo.png`, width: 1200, height: 630, alt: explainer.frontmatter.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: explainer.frontmatter.title,
      description: explainer.frontmatter.excerpt,
      images: [`${baseUrl}/blacklogo.png`],
    },
  };
}

export default async function ExplainerPage({ params }: Props) {
  const { slug } = await params;
  const explainer = getExplainer(slug);

  if (!explainer) notFound();

  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://vibestale.com';
  const fullUrl = `${baseUrl}/explains/${explainer.frontmatter.slug}`;

  const bannerAdImage = '/advert%20design.png';
  const portraitAdImage = '/Advertise%20with%20vibestale.png';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: explainer.frontmatter.title,
    description: explainer.frontmatter.excerpt,
    datePublished: explainer.frontmatter.published_at,
    dateModified: explainer.frontmatter.published_at,
    author: { '@type': 'Organization', name: 'Vibestale', url: baseUrl },
    publisher: {
      '@type': 'Organization',
      name: 'Vibestale',
      logo: { '@type': 'ImageObject', url: `${baseUrl}/blacklogo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': fullUrl },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="md:hidden mb-4">
        <a
          href="https://wa.me/2348038887589"
          target="_blank"
          rel="noopener noreferrer"
          className="block overflow-hidden rounded-xl border border-[var(--border)]"
        >
          <Image
            src={bannerAdImage}
            alt="Advertisement"
            className="w-full h-auto object-cover"
            width={320}
            height={100}
            loading="lazy"
          />
        </a>
      </div>

      <div className="md:flex md:gap-8">
        <PortraitAdBanner />

        <div className="flex-1 min-w-0">
          <div className="md:hidden mb-4">
            <LiveClock initialTime={serverNow} />
          </div>

          <Link
            href="/explains"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] mb-4 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Explains
          </Link>

          <article className="bg-[var(--surface)] rounded-2xl shadow-lg border border-[var(--border)] overflow-hidden">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded-full text-xs font-semibold mb-4">
                <BookOpen className="w-3.5 h-3.5" />
                {explainer.frontmatter.category}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-4 font-space-grotesk leading-tight">
                {explainer.frontmatter.title}
              </h1>

              <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
                {explainer.frontmatter.excerpt}
              </p>

              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[var(--border)] text-sm text-[var(--text-tertiary)] flex-wrap">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(explainer.frontmatter.published_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {explainer.frontmatter.reading_time} read
                </span>
                <span className="text-[var(--text-tertiary)]">By {explainer.frontmatter.author}</span>
              </div>

              <div className="prose prose-lg max-w-none prose-headings:font-space-grotesk prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-p:leading-relaxed prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline prose-strong:text-[var(--text-primary)] prose-ul:text-[var(--text-secondary)] prose-ol:text-[var(--text-secondary)]">
                <MDXRemote source={explainer.content} />
              </div>
            </div>
          </article>

          <div className="md:hidden mt-6">
            <a
              href="https://wa.me/2348038887589"
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-xl border border-[var(--border)]"
            >
              <Image
                src={portraitAdImage}
                alt="Advertisement"
                className="w-full h-auto object-cover"
                style={{ minHeight: '400px' }}
                width={256}
                height={600}
                loading="lazy"
              />
            </a>
          </div>

          <div className="mt-6">
            <NewsletterSignup />
          </div>

          <div className="mt-6 bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6">
            <p className="text-xs font-semibold text-[var(--text-tertiary)] uppercase tracking-wider mb-3">
              More from Vibestale Explains
            </p>
            <Link
              href="/explains"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline"
            >
              Browse all explainers →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
