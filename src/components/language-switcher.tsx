'use client';

import type { Locale } from '@/lib/i18n';

const LABELS: Record<Locale, string> = { fr: 'FR', en: 'EN', ar: 'AR' };

export function LanguageSwitcher({ current }: { current: Locale }) {
  function pick(next: Locale) {
    document.cookie = `lang=${next}; path=/; max-age=31536000; samesite=lax`;
    // A full reload re-renders server content (and the SATIM language) in the new locale.
    window.location.reload();
  }

  return (
    <select
      aria-label="Language"
      value={current}
      onChange={(e) => pick(e.target.value as Locale)}
      className="h-9 rounded-md border bg-card px-2 text-sm text-foreground"
    >
      {(Object.keys(LABELS) as Locale[]).map((l) => (
        <option key={l} value={l}>
          {LABELS[l]}
        </option>
      ))}
    </select>
  );
}
