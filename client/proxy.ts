import { NextResponse, type NextRequest } from "next/server";
const locales = ["en", "ru", "uz"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (
    locales.some(
      (locale) =>
        pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
    )
  )
    return NextResponse.next();
  const preferred = request.headers
    .get("accept-language")
    ?.toLowerCase()
    .startsWith("ru")
    ? "ru"
    : request.headers.get("accept-language")?.toLowerCase().startsWith("uz")
      ? "uz"
      : "en";
  request.nextUrl.pathname = `/${preferred}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
