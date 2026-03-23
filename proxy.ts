import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en-US", "es-MX"] as const;
const defaultLocale = "en-US";

function getPreferredLocale(request: NextRequest) {
  const header = request.headers.get("accept-language");

  if (!header) {
    return defaultLocale;
  }

  const requestedLocales = header
    .split(",")
    .map((part) => part.trim().split(";")[0])
    .filter(Boolean);

  for (const requestedLocale of requestedLocales) {
    if (locales.includes(requestedLocale as (typeof locales)[number])) {
      return requestedLocale;
    }

    const language = requestedLocale.split("-")[0]?.toLowerCase();

    if (language === "es") {
      return "es-MX";
    }

    if (language === "en") {
      return "en-US";
    }
  }

  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  const locale = getPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;

  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};