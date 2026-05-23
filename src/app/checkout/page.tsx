import { CreditCard } from 'lucide-react';
import { PayForm } from '@/components/pay-form';
import { formatPrice } from '@/lib/format';
import { getDictionary } from '@/lib/i18n';
import { getLocale } from '@/lib/locale';
import { PLAN } from '@/lib/plan';

export default async function CheckoutPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const price = formatPrice(PLAN.amountDinars, locale);

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold">{t.checkout.title}</h1>

      <div className="mt-6 rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{t.checkout.summary}</h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">{t.checkout.plan}</dt>
            <dd className="font-medium">{t.store.planName}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">{t.checkout.amount}</dt>
            <dd className="font-medium">{price}</dd>
          </div>
        </dl>

        <div className="my-5 border-t" />

        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">{t.checkout.method}</h2>
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-primary bg-primary/5 p-3">
          <CreditCard className="h-5 w-5 text-primary" />
          <div className="flex-1">
            <div className="text-sm font-medium">{t.checkout.online}</div>
            <div className="text-xs text-muted">{t.checkout.cibEdahabia}</div>
          </div>
          <img src="/assets/cib-dahabia-log.png" alt="CIB / Edahabia" className="h-6 w-auto" />
        </div>

        <div className="my-5 border-t" />

        <div className="mb-5 flex justify-between text-base font-bold">
          <span>{t.checkout.total}</span>
          <span className="text-primary">{price}</span>
        </div>

        <PayForm
          locale={locale}
          labels={{ cgv: t.checkout.cgv, pay: t.checkout.pay, paying: t.checkout.paying, cancel: t.checkout.cancel }}
        />
      </div>
    </div>
  );
}
