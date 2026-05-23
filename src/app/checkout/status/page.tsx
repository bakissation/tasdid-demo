import Link from 'next/link';
import { CheckCircle2, Clock, HelpCircle, Mail, Phone, XCircle } from 'lucide-react';
import { ReceiptActions } from '@/components/receipt-actions';
import { getCheckout } from '@/lib/checkout';
import { formatDateTime, formatPrice } from '@/lib/format';
import { getDictionary } from '@/lib/i18n';
import { getLocale } from '@/lib/locale';
import { failureReason } from '@bakissation/tasdid';

export const dynamic = 'force-dynamic';

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wider text-muted">{label}</div>
      <div className={`mt-1 text-sm font-semibold ${mono ? 'font-mono' : ''}`}>{value}</div>
    </div>
  );
}

export default async function StatusPage({ searchParams }: { searchParams: Promise<{ payment?: string }> }) {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const { payment: paymentId } = await searchParams;

  const result = paymentId ? await getCheckout().get(paymentId) : null;

  const isSuccess = result?.status === 'paid';
  const isFailed = result?.status === 'failed' || result?.status === 'expired';
  // SATIM cert rule: error reason = respCodeDesc → actionCodeDescription.
  const errorMessage = result ? failureReason(result.satim) : null;
  const at = result?.history.find((h) => h.to === result.status)?.at ?? result?.history[0]?.at ?? null;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
        <div
          className={`py-8 text-center text-white ${
            isSuccess
              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
              : isFailed
                ? 'bg-gradient-to-r from-red-500 to-rose-600'
                : 'bg-gradient-to-r from-amber-500 to-orange-600'
          }`}
        >
          <div className="mb-3 flex justify-center">
            {isSuccess ? (
              <CheckCircle2 className="h-14 w-14" />
            ) : isFailed ? (
              <XCircle className="h-14 w-14" />
            ) : (
              <Clock className="h-14 w-14 animate-pulse" />
            )}
          </div>
          <h1
            data-testid={isSuccess ? 'status-success' : isFailed ? 'status-failed' : 'status-processing'}
            className="text-2xl font-bold tracking-tight"
          >
            {isSuccess ? t.status.success : isFailed ? t.status.failed : t.status.processing}
          </h1>
        </div>

        <div className="p-6 sm:p-8">
          {!result ? (
            <p className="text-center text-sm text-muted">—</p>
          ) : (
            <>
              {/* Cert rule #1/#2: transaction details ONLY when not failed. */}
              {!isFailed && (
                <div data-testid="tx-details" className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-8">
                  <DetailRow label={t.status.receiptNo} value={`#${result.id.slice(0, 8)}`} mono />
                  {isSuccess && result.orderId && (
                    <DetailRow label={t.status.transactionId} value={result.orderId} mono />
                  )}
                  <DetailRow label={t.status.orderNumber} value={result.orderNumber} mono />
                  {result.satim.approvalCode && (
                    <DetailRow label={t.status.approvalCode} value={result.satim.approvalCode} mono />
                  )}
                  {at && <DetailRow label={t.status.dateTime} value={formatDateTime(at, locale)} />}
                  <DetailRow label={t.status.amount} value={formatPrice(result.amount.toDinars(), locale)} />
                  <DetailRow label={t.status.paymentMode} value="CIB / Edahabia" />
                </div>
              )}

              {/* Cert rule #2/#3: failure shows ONLY the reason + helpline, no transaction details. */}
              {isFailed && (
                <div className="space-y-5">
                  <div className="rounded-lg border border-red-200 bg-red-50/60 p-5 dark:border-red-900/30 dark:bg-red-900/10">
                    <div className="text-xs font-medium text-red-600/80 dark:text-red-400/80">{t.status.errorMessage}</div>
                    <p data-testid="error-reason" className="mt-0.5 text-sm font-semibold text-red-800 dark:text-red-200">
                      {errorMessage ?? t.status.failed}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/60 p-4 text-center dark:border-amber-900/30 dark:bg-amber-900/10">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">{t.status.contactSupport}</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <a
                        href="tel:3020"
                        className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200"
                      >
                        <Phone className="h-4 w-4" /> 3020
                      </a>
                      <a
                        href="mailto:support@satim.dz"
                        className="inline-flex items-center gap-1.5 rounded-md bg-amber-100 px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200"
                      >
                        <Mail className="h-4 w-4" /> support@satim.dz
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="my-6 border-t" />

              <div className="flex items-center gap-3 rounded-lg border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-900/30 dark:bg-blue-900/10">
                <HelpCircle className="h-5 w-5 shrink-0 text-blue-500" />
                <p className="text-sm text-blue-700 dark:text-blue-300">{t.status.helpMessage}</p>
              </div>

              {/* Cert rule #4: the OFFICIAL BRANDED 3020 image + CIB/Edahabia logo (not just text). */}
              <div className="mt-5 flex w-full items-center justify-around gap-4">
                <img src="/assets/cib-dahabia-log.png" alt="CIB / Edahabia" className="h-12 w-auto" />
                <img src="/assets/satim-help-line.png" alt="SATIM — Numéro Vert 3020" className="h-12 w-auto" />
              </div>
            </>
          )}
        </div>

        <div className="no-print flex flex-col gap-4 border-t bg-background/40 p-6 sm:flex-row sm:items-center sm:justify-between">
          <ReceiptActions
            enabled={isSuccess}
            labels={{ download: t.common.download, print: t.common.print, email: t.common.email }}
            receipt={
              result
                ? {
                    receiptNo: `#${result.id.slice(0, 8)}`,
                    orderNumber: result.orderNumber,
                    transactionId: result.orderId ?? '',
                    approvalCode: result.satim.approvalCode ?? '',
                    amount: formatPrice(result.amount.toDinars(), locale),
                    date: at ? formatDateTime(at, locale) : '',
                  }
                : null
            }
          />
          <Link
            href="/"
            className="rounded-lg border bg-card px-4 py-2 text-center text-sm font-medium hover:bg-background"
          >
            {t.status.backToStore}
          </Link>
        </div>
      </div>
    </div>
  );
}
