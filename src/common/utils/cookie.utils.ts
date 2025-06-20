// cookie.utils.ts
import { Response } from 'express';

export type CookieOptions = {
  maxAge: number;
  httpOnly: boolean;
  sameSite: 'Strict' | 'Lax' | 'None';
  secure: boolean;
  path?: string;
  domain?: string;
};

// Central config
const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'Lax' as const,
  secure: true,
  path: '/',
  domain: process.env.COOKIE_DOMAIN || 'localhost'
};

// Cookie presets
export const cookiePresets = {
  refreshToken: {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  },
  accessToken: {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
  },
  userRole: {
    ...BASE_COOKIE_OPTIONS,
    maxAge: 1000 * 60 * 60 * 2, // 2 hours
  },
};

// Function to get cookie data for frontend
export function getCookieData(name: string, value: string, options: CookieOptions) {
  const expiresDate = new Date(Date.now() + options.maxAge).toUTCString();
  
  return {
    name,
    value,
    options: {
      maxAge: Math.floor(options.maxAge / 1000),
      expires: expiresDate,
      httpOnly: options.httpOnly,
      sameSite: options.sameSite,
      secure: options.secure,
      path: options.path ?? '/',
      domain: options.domain
    }
  };
}

// Keep the original setCookie function for backend use
export function setCookie(
  res: Response,
  name: string,
  value: string,
  options: CookieOptions,
) {
  const effectiveSameSite = options.secure ? options.sameSite : 'Lax';

  const expiresDate = new Date(Date.now() + options.maxAge).toUTCString();

  const cookieParts = [
    `${name}=${encodeURIComponent(value)}`,
    `Max-Age=${Math.floor(options.maxAge / 1000)}`,
    `Expires=${expiresDate}`,
    options.httpOnly ? 'HttpOnly' : '',
    `SameSite=${effectiveSameSite}`,
    options.secure ? 'Secure' : '',
    `Path=${options.path ?? '/'}`,
    `Domain=${options.domain ?? ''}`,
  ].filter(Boolean);

  const cookie = cookieParts.join('; ');

  const existing = res.getHeader('Set-Cookie');
  if (Array.isArray(existing)) {
    res.setHeader('Set-Cookie', [...existing, cookie]);
  } else if (typeof existing === 'string') {
    res.setHeader('Set-Cookie', [existing, cookie]);
  } else {
    res.setHeader('Set-Cookie', cookie);
  }
}
