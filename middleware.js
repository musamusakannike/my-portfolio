import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl;

  // We only care about visitors coming directly to the root path '/'
  if (pathname !== '/') {
    return NextResponse.next();
  }

  // Check query params or cookies first to see if the user explicitly prefers English/Arabic
  const cookieLocale = request.cookies.get('preferred_locale')?.value;
  const urlLocale = searchParams.get('locale');

  // Explicit override: ?locale=en
  if (cookieLocale === 'en' || urlLocale === 'en') {
    const response = NextResponse.next();
    if (urlLocale === 'en') {
      response.cookies.set('preferred_locale', 'en', { maxAge: 60 * 60 * 24 * 30, path: '/' }); // 30 days
    }
    return response;
  }

  // Explicit override: ?locale=ar
  if (cookieLocale === 'ar' || urlLocale === 'ar') {
    const response = NextResponse.redirect(new URL('/ar', request.url));
    if (urlLocale === 'ar') {
      response.cookies.set('preferred_locale', 'ar', { maxAge: 60 * 60 * 24 * 30, path: '/' });
    }
    return response;
  }

  // Now detect if the user is an Arabic visitor
  // 1. Check Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || '';
  const isArabicLanguage = /\bar\b|\bar-[a-z]{2}\b/i.test(acceptLanguage);

  // 2. Check GeoIP / Country code (Vercel sets geo header or x-vercel-ip-country)
  const country = request.geo?.country || request.headers.get('x-vercel-ip-country') || '';
  const arabCountries = [
    'SA', 'AE', 'EG', 'QA', 'KW', 'OM', 'BH', 'YE', 'JO', 'LB', 'SY', 'IQ', 
    'PS', 'LY', 'TN', 'DZ', 'MA', 'MR', 'SD', 'SO', 'DJ', 'KM'
  ];
  const isArabCountry = country && arabCountries.includes(country.toUpperCase());

  // If visitor's language is Arabic or country is an Arab country, redirect to /ar
  if (isArabicLanguage || isArabCountry) {
    const response = NextResponse.redirect(new URL('/ar', request.url));
    response.cookies.set('preferred_locale', 'ar', { maxAge: 60 * 60 * 24 * 30, path: '/' });
    return response;
  }

  // Default: proceed to requested page
  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
