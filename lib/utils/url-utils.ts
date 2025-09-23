/**
 * Get dynamic base URL for return URLs across different environments
 * Prioritizes deploy preview URLs over main site URLs on Netlify
 */
export function getReturnUrl(path: string = ''): string {
  // On Netlify, prioritize deploy preview URL over main site URL
  if (process.env.DEPLOY_PRIME_URL) {
    return `${process.env.DEPLOY_PRIME_URL}${path}`;
  }

  // Fallback to main site URL on Netlify
  if (process.env.URL) {
    return `${process.env.URL}${path}`;
  }

  // Fallback for local development or other hosting
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = process.env.VERCEL_URL || 'localhost:3000';
  return `${protocol}://${host}${path}`;
}

/**
 * Get all available URL environment variables for debugging
 */
export function getUrlDebugInfo() {
  return {
    deployPrimeUrl: process.env.DEPLOY_PRIME_URL || 'not set',
    url: process.env.URL || 'not set',
    vercelUrl: process.env.VERCEL_URL || 'not set',
    nodeEnv: process.env.NODE_ENV || 'not set',
    currentReturnUrl: getReturnUrl(),
    context: process.env.CONTEXT || 'not set',
  };
}