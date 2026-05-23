import { ReconcileButton } from '@/components/reconcile-button';
import { store } from '@/lib/checkout';
import { formatPrice } from '@/lib/format';
import { getDictionary } from '@/lib/i18n';
import { getLocale } from '@/lib/locale';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  let pending: Array<{ orderNumber: string; status: string; amountCentimes: number; createdAt: string }> = [];
  try {
    pending = await store().listPending();
  } catch {
    // Redis not reachable (e.g. during a static probe) — show an empty list.
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">{t.admin.title}</h1>
      <p className="mt-1 text-sm text-muted">{t.admin.subtitle}</p>

      <section className="mt-6 rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="font-semibold">{t.admin.reconcile}</h2>
        <p className="mt-1 text-sm text-muted">{t.admin.reconcileHint}</p>
        <div className="mt-4">
          <ReconcileButton label={t.admin.reconcileNow} busyLabel={t.admin.reconciling} />
        </div>
        <details className="mt-4 text-sm">
          <summary className="cursor-pointer text-muted">{t.admin.advanced}</summary>
          <p className="mt-2 text-muted">{t.admin.advancedHint}</p>
          <code className="mt-2 block rounded-md border bg-background p-2 text-xs">
            curl -H &quot;Authorization: Bearer $PAY_ADMIN_TOKEN&quot; http://localhost:3000/api/pay/reconcile
          </code>
        </details>
      </section>

      <section className="mt-6 rounded-2xl border bg-card p-6 shadow-sm">
        <h2 className="font-semibold">{t.admin.pending}</h2>
        {pending.length === 0 ? (
          <p className="mt-3 text-sm text-muted">{t.admin.none}</p>
        ) : (
          <ul className="mt-3 divide-y">
            {pending.map((p) => (
              <li key={p.orderNumber} className="flex items-center justify-between py-2 text-sm">
                <span className="font-mono">{p.orderNumber}</span>
                <span className="text-muted">{p.status}</span>
                <span className="font-medium">{formatPrice(p.amountCentimes / 100, locale)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
