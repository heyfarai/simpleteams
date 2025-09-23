/**
 * Get dynamic base URL for return URLs across different environments
 * Handles all Netlify deployment contexts correctly
 */
export function getReturnUrl(path: string = ''): string {
  // Priority 1: Deploy-specific URL (branch deploys, deploy previews)
  // This ensures users stay on the same deployment they're testing
  if (process.env.DEPLOY_PRIME_URL) {
    return `${process.env.DEPLOY_PRIME_URL}${path}`;
  }

  // Priority 2: Unique deploy URL (fallback for individual deploys)
  if (process.env.DEPLOY_URL) {
    return `${process.env.DEPLOY_URL}${path}`;
  }

  // Priority 3: Main site URL (production builds)
  if (process.env.URL) {
    return `${process.env.URL}${path}`;
  }

  // Priority 4: Vercel deployment URL
  if (process.env.VERCEL_URL) {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    return `${protocol}://${process.env.VERCEL_URL}${path}`;
  }

  // Priority 5: Local development fallback
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const host = 'localhost:3000';
  return `${protocol}://${host}${path}`;
}

/**
 * Get all available URL environment variables for debugging
 */
export function getUrlDebugInfo() {
  return {
    // Primary URL determination
    currentReturnUrl: getReturnUrl(),

    // Netlify environment variables (in priority order)
    deployPrimeUrl: process.env.DEPLOY_PRIME_URL || 'not set',
    deployUrl: process.env.DEPLOY_URL || 'not set',
    url: process.env.URL || 'not set',

    // Netlify context information
    context: process.env.CONTEXT || 'not set',
    deployId: process.env.DEPLOY_ID || 'not set',
    siteName: process.env.SITE_NAME || 'not set',

    // Other hosting platforms
    vercelUrl: process.env.VERCEL_URL || 'not set',

    // Environment info
    nodeEnv: process.env.NODE_ENV || 'not set',
  };
}