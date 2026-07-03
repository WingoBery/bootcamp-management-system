/**
 * Public API base URL — injected at build time via NEXT_PUBLIC_API_URL.
 * Must be the URL the browser uses to reach the gateway (not internal Docker hostnames).
 */
export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';
}
