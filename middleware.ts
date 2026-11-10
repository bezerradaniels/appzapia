import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export const RESERVED_SLUGS = [
  "admin",
  "api",
  "login",
  "cadastro",
  "onboarding",
  "checkout",
  "termos",
  "privacidade",
  "www",
  "app",
  "zapia",
];

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let user = null;

  if (supabaseUrl && supabaseKey) {
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") || "";
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "zapia.app";

  // Extract potential subdomain (supports *.zapia.app and *.localhost:3000)
  const cleanHost = hostname.split(":")[0];
  let subdomain: string | null = null;

  if (cleanHost.endsWith(`.${rootDomain}`)) {
    subdomain = cleanHost.replace(`.${rootDomain}`, "");
  } else if (cleanHost.endsWith(".localhost")) {
    subdomain = cleanHost.replace(".localhost", "");
  }

  // Ignore www or empty subdomain
  if (subdomain && subdomain !== "www" && !RESERVED_SLUGS.includes(subdomain)) {
    // Block /admin or /login on tenant subdomains -> redirect to main domain
    if (
      url.pathname.startsWith("/admin") ||
      url.pathname.startsWith("/login") ||
      url.pathname.startsWith("/onboarding")
    ) {
      const protocol = request.nextUrl.protocol;
      return NextResponse.redirect(
        new URL(`${protocol}//${rootDomain}${url.pathname}`, request.url)
      );
    }

    // Rewrite invisibly to /app/[storeSlug]${pathname}
    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = `/${subdomain}${url.pathname}`;
    const rewriteResponse = NextResponse.rewrite(rewriteUrl);

    // Preserve Supabase auth cookies on rewrite
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      rewriteResponse.cookies.set(cookie.name, cookie.value);
    });

    return rewriteResponse;
  }

  // Main domain route protection for /admin and /onboarding
  if (
    (url.pathname.startsWith("/admin") ||
      url.pathname.startsWith("/onboarding")) &&
    !user
  ) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|logos/|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
