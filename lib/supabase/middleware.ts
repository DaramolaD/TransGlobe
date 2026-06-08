import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ROLE_HOME, type UserRole } from "@/lib/auth/roles";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    if (
      request.nextUrl.pathname.startsWith("/app") ||
      request.nextUrl.pathname === "/login"
    ) {
      const redirect = new URL("/login?error=config", request.url);
      return NextResponse.redirect(redirect);
    }
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isApp = pathname.startsWith("/app");
  const isLogin = pathname === "/login";
  const isAuthFlow =
    pathname.startsWith("/login/forgot-password") ||
    pathname.startsWith("/login/reset-password") ||
    pathname.startsWith("/auth/callback");

  if (isApp && !user) {
    const redirect = new URL("/login", request.url);
    redirect.searchParams.set("next", pathname);
    return NextResponse.redirect(redirect);
  }

  if (user && (isApp || isLogin) && !isAuthFlow) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, is_active")
      .eq("id", user.id)
      .single();

    if (!profile?.is_active) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/login?error=inactive", request.url));
    }

    const role = profile.role as UserRole;
    const home = ROLE_HOME[role] ?? "/app/portal";

    if (isLogin) {
      return NextResponse.redirect(new URL(home, request.url));
    }

    if (pathname === "/app") {
      return NextResponse.redirect(new URL(home, request.url));
    }

    const allowedPrefixes: Record<UserRole, string[]> = {
      superadmin: ["/app/superadmin", "/app/admin", "/app/driver", "/app/portal", "/app/cms", "/app/sales"],
      admin: ["/app/admin", "/app/cms"],
      sales: ["/app/sales"],
      driver: ["/app/driver"],
      user: ["/app/portal"],
    };

    const allowed = allowedPrefixes[role] ?? ["/app/portal"];
    const ok = allowed.some((p) => pathname.startsWith(p));
    if (isApp && !ok) {
      return NextResponse.redirect(new URL(home, request.url));
    }
  }

  return supabaseResponse;
}
