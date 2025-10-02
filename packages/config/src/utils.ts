// URL utilities
export function getReturnUrl(currentUrl: string): string {
  const url = new URL(currentUrl);
  return `${url.origin}/dashboard`;
}

export function getUrlDebugInfo(url: string) {
  const parsed = new URL(url);
  return {
    origin: parsed.origin,
    pathname: parsed.pathname,
    search: parsed.search,
    hash: parsed.hash,
  };
}
