/**
 * Language Utility Module
 *
 * Provides language preference management for the public website.
 * Uses cookies to persist the user's language choice across sessions.
 */

export type Language = 'ar' | 'en';

const LANGUAGE_COOKIE = 'lang';
const DEFAULT_LANGUAGE: Language = 'ar';

/**
 * Get the user's language preference from a cookie string.
 * Returns 'ar' by default if not set or invalid.
 */
export function getLanguagePreference(cookieString?: string): Language {
  if (!cookieString) return DEFAULT_LANGUAGE;

  const cookies = parseCookies(cookieString);
  const lang = cookies[LANGUAGE_COOKIE];

  if (lang === 'en' || lang === 'ar') {
    return lang;
  }

  return DEFAULT_LANGUAGE;
}

/**
 * Get language preference from document.cookie (client-side).
 */
export function getClientLanguage(): Language {
  if (typeof document === 'undefined') return DEFAULT_LANGUAGE;
  return getLanguagePreference(document.cookie);
}

/**
 * Set the language preference cookie (client-side).
 * Cookie persists for 1 year.
 */
export function setLanguagePreference(lang: Language): void {
  if (typeof document === 'undefined') return;

  const maxAge = 365 * 24 * 60 * 60; // 1 year in seconds
  document.cookie = `${LANGUAGE_COOKIE}=${lang};path=/;max-age=${maxAge};samesite=lax`;
}

/**
 * Get the cookie header value for setting language preference (server-side).
 */
export function getLanguageCookieHeader(lang: Language): string {
  const maxAge = 365 * 24 * 60 * 60;
  return `${LANGUAGE_COOKIE}=${lang}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

/**
 * Simple cookie parser.
 */
function parseCookies(cookieString: string): Record<string, string> {
  const cookies: Record<string, string> = {};

  cookieString.split(';').forEach((pair) => {
    const [key, ...valueParts] = pair.split('=');
    if (key) {
      cookies[key.trim()] = valueParts.join('=').trim();
    }
  });

  return cookies;
}

/**
 * Get text direction for the given language.
 */
export function getDirection(lang: Language): 'rtl' | 'ltr' {
  return lang === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Get the language display name.
 */
export function getLanguageLabel(lang: Language): string {
  return lang === 'ar' ? 'العربية' : 'English';
}
