import { describe, it, expect } from 'vitest';
import { formatDateTime, formatPrice } from '@/lib/format';
import { DEFAULT_LOCALE, dir, getDictionary, isLocale, LOCALES } from '@/lib/i18n';

/** All leaf key paths of a nested object (arrays compared by index). */
function keyPaths(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value)) return value.flatMap((v, i) => keyPaths(v, `${prefix}[${i}]`));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => keyPaths(v, prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}

describe('i18n', () => {
  it('defaults to French', () => {
    expect(DEFAULT_LOCALE).toBe('fr');
  });

  it('isLocale accepts valid locales and rejects anything else', () => {
    expect(isLocale('fr')).toBe(true);
    expect(isLocale('ar')).toBe(true);
    expect(isLocale('de')).toBe(false);
    expect(isLocale(undefined)).toBe(false);
    expect(isLocale(5)).toBe(false);
  });

  it('Arabic is RTL, the rest LTR', () => {
    expect(dir('ar')).toBe('rtl');
    expect(dir('fr')).toBe('ltr');
    expect(dir('en')).toBe('ltr');
  });

  it('every locale has the exact same key set (no missing translations)', () => {
    const reference = keyPaths(getDictionary('fr')).sort();
    for (const l of LOCALES) {
      expect(keyPaths(getDictionary(l)).sort(), `locale ${l}`).toEqual(reference);
    }
  });

  it.each(LOCALES)('cert-critical status copy is non-empty for %s', (l) => {
    const t = getDictionary(l);
    expect(t.status.success).toBeTruthy();
    expect(t.status.failed).toBeTruthy();
    expect(t.status.errorMessage).toBeTruthy();
    expect(t.status.orderNumber).toBeTruthy();
    expect(t.status.approvalCode).toBeTruthy();
  });
});

describe('format', () => {
  it.each(LOCALES)('formats a DZD amount for %s', (l) => {
    const s = formatPrice(5000, l);
    expect(s).toContain('DZD');
  });

  it('formats a date/time as a string', () => {
    expect(typeof formatDateTime('2026-05-23T10:00:00Z', 'en')).toBe('string');
  });
});
