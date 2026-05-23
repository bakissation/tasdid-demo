'use client';

import { Download, Mail, Printer } from 'lucide-react';

interface Receipt {
  receiptNo: string;
  orderNumber: string;
  transactionId: string;
  approvalCode: string;
  amount: string;
  date: string;
}

interface Labels {
  download: string;
  print: string;
  email: string;
}

export function ReceiptActions({
  enabled,
  labels,
  receipt,
}: {
  enabled: boolean;
  labels: Labels;
  receipt: Receipt | null;
}) {
  function download() {
    if (!receipt) return;
    // The receipt must carry the order number (a logged SATIM cert failure when missing).
    const lines = [
      'TASDID STORE — Reçu de paiement',
      '================================',
      `N° Reçu:        ${receipt.receiptNo}`,
      `N° de commande: ${receipt.orderNumber}`,
      `Transaction:    ${receipt.transactionId}`,
      `Autorisation:   ${receipt.approvalCode}`,
      `Montant:        ${receipt.amount}`,
      `Date:           ${receipt.date}`,
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recu-${receipt.orderNumber}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function email() {
    if (!receipt) return;
    const subject = encodeURIComponent(`Reçu — commande ${receipt.orderNumber}`);
    const body = encodeURIComponent(
      `N° de commande: ${receipt.orderNumber}\nMontant: ${receipt.amount}\nDate: ${receipt.date}`,
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  const cls =
    'inline-flex items-center gap-1.5 rounded-md border bg-card px-3 py-1.5 text-sm font-medium transition enabled:hover:bg-background disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" data-testid="receipt-download" onClick={download} disabled={!enabled} className={cls}>
        <Download className="h-4 w-4" /> {labels.download}
      </button>
      <button type="button" onClick={() => window.print()} disabled={!enabled} className={cls}>
        <Printer className="h-4 w-4" /> {labels.print}
      </button>
      <button type="button" onClick={email} disabled={!enabled} className={cls}>
        <Mail className="h-4 w-4" /> {labels.email}
      </button>
    </div>
  );
}
