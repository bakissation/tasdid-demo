import { cookies } from 'next/headers';
import { DEFAULT_LOCALE, isLocale, type Locale } from './i18n';

export const LOCALE_COOKIE = 'lang';

/** Resolve the active locale from the `lang` cookie (server components / routes). */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
