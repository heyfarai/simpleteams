import { NextResponse } from 'next/server';
import { healthCheck } from '@/lib/health-check';

export async function GET() {
  const health = await healthCheck();

  return NextResponse.json(health, {
    status: health.healthy ? 200 : 503
  });
}