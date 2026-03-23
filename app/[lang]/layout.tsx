import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { getDictionary, hasLocale, locales, type Locale } from "./dictionaries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    return {};
  }

  const dict = await getDictionary(lang);

  return {
    title: dict.metadata.title,
    description: dict.metadata.description,
  };
}

function LanguageSwitcher({
  currentLocale,
  labels,
}: {
  currentLocale: Locale;
  labels: Record<Locale, string>;
}) {
  return (
    <div className="flex items-center gap-2">
      {locales.map((locale) => {
        const isActive = locale === currentLocale;

        return (
          <Link
            key={locale}
            href={`/${locale}`}
            className={[
              "rounded px-2.5 py-1 text-xs font-semibold transition",
              isActive
                ? "bg-white text-blue-700"
                : "border border-white/35 bg-white/10 text-white hover:bg-white/20",
            ].join(" ")}
          >
            {labels[locale]}
          </Link>
        );
      })}
    </div>
  );
}

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-100 text-slate-900">
        <header className="border-b border-slate-300 bg-blue-600 text-white shadow-sm">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                aria-label={dict.layout.openMenu}
                title={dict.layout.openMenu}
                className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded border border-white/40 bg-white/10 transition hover:bg-white/20"
              >
                <span className="h-0.5 w-5 bg-white" />
                <span className="h-0.5 w-5 bg-white" />
                <span className="h-0.5 w-5 bg-white" />
              </button>

              <div className="hidden lg:block">
                <LanguageSwitcher
                  currentLocale={lang}
                  labels={dict.layout.languageNames}
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
              <div className="lg:hidden">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">
                  {dict.layout.languageLabel}
                </p>
                <LanguageSwitcher
                  currentLocale={lang}
                  labels={dict.layout.languageNames}
                />
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-sm font-medium">{dict.layout.userLabel}</span>
                <button
                  type="button"
                  className="rounded border border-white/40 px-3 py-1.5 text-sm font-medium transition hover:bg-white/20"
                >
                  {dict.layout.logout}
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>

        <footer className="border-t border-slate-300 bg-white">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-4 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
            <p>{dict.layout.copyright}</p>
            <a
              href="https://github.com/enrikesancheztec/movies-app"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blue-600 underline-offset-4 hover:underline"
            >
              {dict.layout.repository}
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}