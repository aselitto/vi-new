import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { AppConfig } from './utils/AppConfig';

const intlMiddleware = createMiddleware({
  locales: AppConfig.locales,
  localePrefix: AppConfig.localePrefix,
  defaultLocale: AppConfig.defaultLocale,
});

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/:locale/dashboard(.*)',
]);

export default function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  const pathname = request.nextUrl.pathname;

  // Exclude API routes from internationalization and Clerk middleware
  if (pathname.startsWith('/api')) {
    return;
  }

  // Run Clerk middleware only when necessary
  if (
    pathname.includes('/sign-in')
    || pathname.includes('/sign-up')
    || isProtectedRoute(request)
  ) {
    return clerkMiddleware((auth, req) => {
      if (isProtectedRoute(req)) {
        const locale
          = req.nextUrl.pathname.match(/(\/.*)\/dashboard/)?.[1] ?? '';

        const signInUrl = new URL(`${locale}/sign-in`, req.url);

        auth().protect({
          // `unauthenticatedUrl` is needed to avoid errors related to internationalization
          unauthenticatedUrl: signInUrl.toString(),
        });
      }

      return intlMiddleware(req);
    })(request, event);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next|monitoring|api).*)', '/', '/(trpc)(.*)'],
};
