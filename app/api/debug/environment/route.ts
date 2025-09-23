import { NextResponse } from 'next/server';
import { getUrlDebugInfo } from '@/lib/utils/url-utils';

export async function GET() {
  const debugInfo = getUrlDebugInfo();

  return NextResponse.json(debugInfo);
}