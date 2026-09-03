import type { Metadata } from 'next';
import Sidebar from '@/components/Sidebar';
import LiveClock from '@/components/LiveClock';

export const metadata: Metadata = {
  title: 'About VibeStale | AI-Powered Nigerian News & Media',
  description:
    'VibeStale is a Nigerian AI-powered news and media platform. We aggregate headlines from trusted sources, generate neutral AI context, and provide music, movies, live TV, celebrity news, and memes—all in one place.',
};

export default function AboutPage() {
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });

  return (
    <div className="md:flex md:gap-8">
      <Sidebar initialTime={serverNow} />

      <div className="flex-1 min-w-0">
        <div className="md:hidden mb-4">
          <LiveClock initialTime={serverNow} />
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">About VibeStale</h1>
        <p className="text-sm text-gray-400 mb-6">
          Understand what’s happening, know why it matters.
        </p>

        <div className="space-y-8 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Who We Are</h2>
            <p>
              VibeStale is a Nigerian news and media intelligence platform that combines
              real-time headlines with artificial intelligence to give you context, clarity,
              and insight. We help you stay informed about politics, business, sports,
              entertainment, technology, and more—without noise or bias.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">What We Do</h2>
            <p>
              We aggregate headlines from some of Nigeria’s most trusted news sources and
              use AI to generate neutral, easy-to-understand summaries. We never copy
              articles. Instead, we link directly to the original publisher so you can read
              the full story from the source.
            </p>
            <p>
              In addition to news, VibeStale offers a rich media experience:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-2">
              <li>🎵 <strong>Music</strong> – listen to official audio tracks.</li>
              <li>🎬 <strong>Music Videos</strong> – watch the latest videos.</li>
              <li>🌟 <strong>Celebrity News</strong> – entertainment gossip and updates.</li>
              <li>🎞️ <strong>Movies</strong> – Nigerian films, action movies, and comedy.</li>
              <li>🔴 <strong>Live TV</strong> – trusted live news channels.</li>
              <li>😂 <strong>Memes</strong> – funny content from popular creators.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">How It Works</h2>
            <p>
              Our system automatically fetches headlines from trusted RSS feeds. For each
              headline, our AI generates a short analysis—covering context, key players,
              and why it matters to Nigerians. The original source is always linked.
            </p>
            <p>
              For music and videos, we use official YouTube content and embed players
              directly on VibeStale, so you can watch or listen without leaving the
              platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Why We Built VibeStale</h2>
            <p>
              We believe Nigerians deserve fast, accurate, and contextual news. Traditional
              media can be slow, biased, or scattered across many websites. VibeStale
              brings everything together in one modern, mobile-friendly platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Our Values</h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Neutrality:</strong> AI summaries are factual and unbiased.</li>
              <li><strong>Transparency:</strong> Sources are always credited and linked.</li>
              <li><strong>Speed:</strong> Fresh headlines appear every few minutes.</li>
              <li><strong>Accessibility:</strong> Optimised for mobile and low bandwidth.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white">Do you write your own articles?</h3>
                <p>
                  No. We aggregate headlines from trusted Nigerian publishers and use AI to
                  provide original summaries and context. We always link to the full story.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">Is VibeStale free?</h3>
                <p>
                  Yes, VibeStale is free to use. In the future, we may introduce premium
                  features, but the core news experience will remain free.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">How often is the news updated?</h3>
                <p>
                  News is updated continuously. Our system checks trusted sources every few
                  minutes and adds new headlines automatically.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white">Can I share VibeStale content?</h3>
                <p>
                  Yes! Use the share menu on any headline or media item to share via
                  WhatsApp, Facebook, X (Twitter), or Telegram.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-3">Contact Us</h2>
            <p>
              For advertising, partnerships, or feedback, reach us on WhatsApp:
            </p>
            <a
              href="https://wa.me/2348038887589"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-2 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition"
            >
              WhatsApp: +234 803 888 7589
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}