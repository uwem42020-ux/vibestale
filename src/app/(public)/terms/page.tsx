// app/(public)/terms/page.tsx
import type { Metadata } from 'next';
import Sidebar from '@/components/Sidebar';
import LiveClock from '@/components/LiveClock';
import { Shield, FileText, AlertTriangle, CheckCircle, Ban, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service | VibeStale',
  description: 'Read the terms and conditions for using VibeStale services.',
};

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-[var(--text-secondary)]">
              Last updated: {lastUpdated}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Agreement */}
          <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[var(--accent)]" />
              Agreement to Terms
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              By accessing or using VibeStale, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
            </p>
          </section>

          {/* Use License */}
          <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[var(--accent)]" />
              Acceptable Use
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              You agree to use VibeStale only for lawful purposes and in accordance with these Terms. You agree not to:
            </p>
            <ul className="space-y-3">
              {[
                'Violate any applicable laws or regulations',
                'Infringe upon intellectual property rights',
                'Attempt to gain unauthorized access to our systems',
                'Interfere with the proper working of the service',
                'Use automated systems to scrape or collect data',
                'Transmit any malicious code or harmful content',
                'Impersonate any person or entity',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Ban className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-[var(--text-secondary)]">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Intellectual Property */}
          <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[var(--accent)]" />
              Intellectual Property
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              The VibeStale name, logo, and all related names, logos, product and service names, designs, and slogans are trademarks of VibeStale or its affiliates. You must not use such marks without prior written permission.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed mt-4">
              News content and articles remain the property of their respective publishers. We provide links to original sources and do not claim ownership over third-party content.
            </p>
          </section>

          {/* Disclaimer */}
          <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[var(--accent)]" />
              Disclaimer
            </h2>
            <div className="bg-[var(--accent)]/5 border border-[var(--accent)]/20 rounded-lg p-4">
              <p className="text-[var(--text-secondary)] leading-relaxed">
                VibeStale is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the accuracy, reliability, or availability of the service. While we strive to provide accurate information, we cannot guarantee that all content is error-free or current.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[var(--accent)]" />
              Limitation of Liability
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              In no event shall VibeStale, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[var(--accent)]" />
              Changes to Terms
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 sm:p-8">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-[var(--accent)]" />
              Contact Us
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              If you have any questions about these Terms, please contact us:
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
                Email: legal@vibestale.com
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}