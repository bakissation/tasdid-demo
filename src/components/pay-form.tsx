'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Locale } from '@/lib/i18n';

interface Labels {
  cgv: string;
  pay: string;
  paying: string;
  cancel: string;
}

export function PayForm({ locale, labels }: { locale: Locale; labels: Labels }) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function pay() {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/pay', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        // The language is the only thing the client controls — amount/order are server-fixed.
        body: JSON.stringify({ language: locale }),
      });
      const data = (await res.json()) as { redirectUrl?: string };
      if (!res.ok || !data.redirectUrl) throw new Error('start failed');
      window.location.href = data.redirectUrl;
    } catch {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <div>
      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          data-testid="cgv"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4"
        />
        <span>{labels.cgv}</span>
      </label>

      <button
        type="button"
        data-testid="pay"
        onClick={pay}
        disabled={!agreed || loading}
        className="mt-5 w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground transition enabled:hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? labels.paying : labels.pay}
      </button>

      {error && (
        <p data-testid="pay-error" className="mt-3 text-center text-sm text-red-600">
          {labels.paying.replace('…', '')} — error
        </p>
      )}

      <Link href="/" className="mt-3 block text-center text-sm text-muted hover:text-foreground">
        {labels.cancel}
      </Link>
    </div>
  );
}
