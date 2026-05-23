import './globals.css';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { dir, getDictionary } from '@/lib/i18n';
import { getLocale } from '@/lib/locale';

export const metadata: Metadata = {
  title: 'Tasdid Store — SATIM payment demo',
  description:
    'Reference storefront for the @bakissation Algerian payments family. Runs entirely on the SATIM mock — no real money.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const theme = (await cookies()).get('theme')?.value === 'dark' ? 'dark' : '';
  const t = getDictionary(locale);

  return (
    <html lang={locale} dir={dir(locale)} className={theme} suppressHydrationWarning>
      <body className="min-h-screen">
        <header className="no-print border-b bg-card/60 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
              <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">ت</span>
              {t.appName}
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/admin" className="rounded-md px-3 py-1.5 text-sm text-muted hover:text-foreground">
                {t.admin.title}
              </Link>
              <LanguageSwitcher current={locale} />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-4 py-10">{children}</main>

        <footer className="no-print mx-auto max-w-5xl px-4 py-8 text-center text-xs text-muted">
          <p className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            {t.common.securedBySatim}
          </p>
          <p className="mt-1">Demo only — runs against @bakissation/satim-testing. No real money moves.</p>
        </footer>
      </body>
    </html>
  );
}
