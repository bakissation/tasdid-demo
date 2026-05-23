'use client';

import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { reconcileNow, type ReconcileSummary } from '@/app/admin/actions';

export function ReconcileButton({ label, busyLabel }: { label: string; busyLabel: string }) {
  const [pending, start] = useTransition();
  const [summary, setSummary] = useState<ReconcileSummary | null>(null);
  const router = useRouter();

  function run() {
    start(async () => {
      setSummary(await reconcileNow());
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        data-testid="reconcile"
        onClick={run}
        disabled={pending}
        className="inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground transition enabled:hover:opacity-90 disabled:opacity-50"
      >
        <RefreshCw className={`h-4 w-4 ${pending ? 'animate-spin' : ''}`} />
        {pending ? busyLabel : label}
      </button>
      {summary && (
        <pre data-testid="reconcile-summary" className="overflow-x-auto rounded-md border bg-card p-3 text-xs">
          {JSON.stringify(summary, null, 2)}
        </pre>
      )}
    </div>
  );
}
