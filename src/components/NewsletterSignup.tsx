'use client';

import { useState } from 'react';
import { Mail, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

interface NewsletterSignupProps {
  variant?: 'card' | 'inline';
  className?: string;
}

export default function NewsletterSignup({ variant = 'card', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setStatus('success');
      setMessage('You are subscribed. Check your inbox soon.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  // Inline variant — single row, no card wrapper
  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-2 ${className}`}>
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            disabled={status === 'loading'}
            className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-50"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
          <ArrowRight className="w-4 h-4" />
        </button>
        {status === 'success' && (
          <p className="text-xs text-green-600 dark:text-green-400 mt-2 sm:mt-0">{message}</p>
        )}
        {status === 'error' && (
          <p className="text-xs text-red-500 mt-2 sm:mt-0">{message}</p>
        )}
      </form>
    );
  }

  // Card variant — vertical layout with heading
  return (
    <div className={`bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-5 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 bg-[var(--accent)]/10 rounded-lg">
          <Mail className="w-4 h-4 text-[var(--accent)]" />
        </div>
        <h3 className="text-sm font-bold text-[var(--text-primary)] uppercase tracking-wider">
          The Vibestale Daily
        </h3>
      </div>
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
        5 things Nigerians need to know today. Delivered every morning.
      </p>

      {status === 'success' ? (
        <div className="flex items-start gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{message}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-tertiary)]" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              disabled={status === 'loading'}
              className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--background)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:outline-none focus:border-[var(--accent)] transition-colors disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[var(--accent)] text-white text-sm font-semibold rounded-lg hover:bg-[var(--accent-hover)] transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? 'Subscribing…' : 'Subscribe Free'}
            <ArrowRight className="w-4 h-4" />
          </button>
          {status === 'error' && (
            <div className="flex items-start gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-500 leading-relaxed">{message}</p>
            </div>
          )}
        </form>
      )}
    </div>
  );
}