export const config = {
  matcher: '/:path*',
};

export default function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  const isFacebookCrawler = userAgent.includes('facebookexternalhit');
  
  // If it's Facebook's crawler, just let it through normally
  // No special handling needed - just return the response
  if (isFacebookCrawler) {
    return;
  }
  
  // For everyone else, also just let it through
  return;
}
