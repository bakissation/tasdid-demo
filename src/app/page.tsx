import Link from 'next/link';
import { Check } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { getDictionary } from '@/lib/i18n';
import { getLocale } from '@/lib/locale';
import { PLAN } from '@/lib/plan';

export default async function Home() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <div className="grid items-center gap-10 md:grid-cols-2">
      <section>
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {t.store.badge}
        </span>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight">{t.store.title}</h1>
        <p className="mt-3 max-w-md text-muted">{t.store.tagline}</p>
      </section>

      <section className="rounded-2xl border bg-card p-8 shadow-sm">
        <div className="flex items-baseline justify-between">
          <div>
            <h2 className="text-lg font-bold">{t.store.planName}</h2>
            <p className="text-sm text-muted">{t.store.planTagline}</p>
          </div>
          <div className="text-end">
            <div className="text-3xl font-extrabold text-primary">{formatPrice(PLAN.amountDinars, locale)}</div>
            <div className="text-xs text-muted">{t.store.perYear}</div>
          </div>
        </div>

        <ul className="mt-6 space-y-3">
          {t.store.features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/checkout"
          data-testid="buy"
          className="mt-8 block w-full rounded-lg bg-primary py-3 text-center font-semibold text-primary-foreground transition hover:opacity-90"
        >
          {t.store.buy}
        </Link>

        <div className="mt-6 flex items-center justify-between border-t pt-4">
          <span className="text-xs text-muted">{t.store.cards}</span>
          <img src="/assets/cib-dahabia-log.png" alt="CIB / Edahabia" className="h-7 w-auto" />
        </div>
      </section>
    </div>
  );
}
