import type { Locale } from './i18n';

const LOCALE_TAG: Record<Locale, string> = { fr: 'fr-DZ', en: 'en-DZ', ar: 'ar-DZ' };

export function formatPrice(amountDinars: number, locale: Locale): string {
  const n = new Intl.NumberFormat(LOCALE_TAG[locale], { maximumFractionDigits: 0 }).format(amountDinars);
  return `${n} DZD`;
}

export function formatDateTime(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(LOCALE_TAG[locale], { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso));
}
