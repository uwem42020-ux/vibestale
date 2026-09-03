// app/(public)/privacy/page.tsx
import type { Metadata } from 'next';
import Sidebar from '@/components/Sidebar';
import LiveClock from '@/components/LiveClock';
import { Shield, Lock, Eye, Database, Mail, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | VibeStale',
  description: 'Learn how VibeStale collects, uses, and protects your personal information.',
};

export default function PrivacyPage() {
  const serverNow = new Date().toLocaleString('en-US', { timeZone: 'Africa/Lagos' });
  const lastUpdated = 'January 1, 2024';

  return (
    <div className="md:flex md:gap-8">
      <Sidebar initialTime={serverNow} />

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
              Legal
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-3 font-space-grotesk">
              Privacy Policy
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
              Introduction
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              VibeStale ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-[var(--accent)]" />
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Personal Data</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  We may collect personally identifiable information that you voluntarily provide to us when you:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-[var(--text-secondary)]">
                  <li>Contact us via WhatsApp or email</li>
                  <li>Subscribe to newsletters (if available)</li>
                  <li>Submit feedback or inquiries</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)] mb-2">Usage Data</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  We automatically collect certain information when you visit our website, including:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 text-[var(--text-secondary)]">
                  <li>Device information (browser type, operating system)</li>
                  <li>IP address and location data</li>
                  <li>Pages visited and time spent on site</li>
                  <li>Referring website addresses</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-[var(--accent)]" />
              How We Use Your Information
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="space-y-3">
              {[
                'Provide, operate, and maintain our website',
                'Improve, personalize, and expand our services',
                'Understand and analyze how you use our website',
                'Develop new products, services, and features',
                'Communicate with you for customer service and updates',
                'Send you promotional content (with your consent)',
                'Prevent fraud and enhance security',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="text-[var(--text-secondary)]">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Cookies */}
          <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-[var(--accent)]" />
              Cookies and Tracking Technologies
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              We may use cookies and similar tracking technologies to track activity on our website and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service.
            </p>
          </section>

          {/* Third-Party Services */}
          <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[var(--accent)]" />
              Third-Party Services
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              We may employ third-party companies and individuals for the following reasons:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-[var(--text-secondary)]">
              <li>To facilitate our website</li>
              <li>To provide website-related services</li>
              <li>To assist us in analyzing how our website is used</li>
            </ul>
            <p className="text-[var(--text-secondary)] leading-relaxed mt-4">
              These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[var(--accent)]" />
              Contact Us
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <div className="mt-4 space-y-2">
              <a
                href="https://wa.me/2348038887589"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors"
              >
                WhatsApp: +234 803 888 7589
              </a>
              <p className="text-[var(--text-secondary)]">
                Email: privacy@vibestale.com
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}