import { NextResponse } from 'next/server';
import { getUrlDebugInfo } from '@/lib/utils/url-utils';

export async function GET() {
  const debugInfo = getUrlDebugInfo();

  // Add raw process.env debugging
  const rawEnvDebug = {
    ...debugInfo,
    rawProcessEnv: {
      DEPLOY_PRIME_URL: process.env.DEPLOY_PRIME_URL,
      DEPLOY_URL: process.env.DEPLOY_URL,
      URL: process.env.URL,
      CONTEXT: process.env.CONTEXT,
      SITE_NAME: process.env.SITE_NAME,
      NETLIFY: process.env.NETLIFY,
      NETLIFY_DEV: process.env.NETLIFY_DEV,
      BUILD_ID: process.env.BUILD_ID,
    }
  };

  return NextResponse.json(rawEnvDebug);
}