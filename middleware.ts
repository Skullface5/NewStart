import { NextResponse, userAgent } from 'next/server';
import type { NextRequest } from 'next/server';

// This tells the middleware to run on all routes
export const config = {
  matcher: '/(.*)',
};

export function middleware(request: NextRequest) {
  const { ua } = userAgent(request);
  const isFacebookCrawler = ua?.includes('facebookexternalhit') ?? false;

  // If it's the Facebook crawler, pass the request along, but add a special header.
  // This can sometimes help Vercel understand this is a "friendly" bot.
  if (isFacebookCrawler) {
    const response = NextResponse.next();
    response.headers.set('x-middleware-cache', 'bypass');
    return response;
  }

  // For all other visitors, just proceed as normal.
  return NextResponse.next();
}
