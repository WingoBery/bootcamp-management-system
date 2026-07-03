/**
 * Public API base URL — injected at build time via NEXT_PUBLIC_API_URL.
 * Production (Nginx): http://15.188.62.236/api
 * Local (gateway direct): http://localhost:8000
 */
export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
}

/** Normalized base ending with /api for gateway routes. */
export function getApiBase(): string {
  const url = getApiUrl().replace(/\/$/, '');
  if (url.endsWith('/api')) {
    return url;
  }
  return `${url}/api`;
}

export function getApiV1Base(): string {
  return `${getApiBase()}/v1`;
}
