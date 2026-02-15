import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { updateSession } from "./lib/supabase/middleware";
import { type NextRequest } from "next/server";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
    // 1. Run next-intl middleware first (locale detection + rewriting)
    const intlResponse = intlMiddleware(request);

    // 2. Refresh Supabase auth session
    // We call updateSession to keep the auth cookie alive.
    // This runs in parallel and doesn't block the response.
    await updateSession(request);

    return intlResponse;
}

export const config = {
    matcher: [
        // Match all pathnames except those starting with:
        // - api, _next, _vercel, monitoring
        // - Files with extensions (e.g. favicon.ico)
        "/((?!api|_next|_vercel|monitoring|.*\\..*).*)",
    ],
};
