'use client';

import { useState } from 'react';
import { getUrlDebugInfo } from '@/lib/utils/url-utils';

export function DebugBanner() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get debug info on client side
  const debugInfo = getUrlDebugInfo();

  return (
    <div className="bg-yellow-400 text-black border-b-2 border-yellow-600">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 font-mono text-sm font-bold w-full"
        >
          🐛 DEBUG MODE - Current URL: {debugInfo.currentReturnUrl}
          <span className="ml-auto">{isExpanded ? '▼' : '▶'}</span>
        </button>

        {isExpanded && (
          <div className="mt-2 p-3 bg-yellow-300 rounded font-mono text-xs space-y-1">
            <div><strong>DEPLOY_PRIME_URL:</strong> {debugInfo.deployPrimeUrl}</div>
            <div><strong>URL:</strong> {debugInfo.url}</div>
            <div><strong>VERCEL_URL:</strong> {debugInfo.vercelUrl}</div>
            <div><strong>NODE_ENV:</strong> {debugInfo.nodeEnv}</div>
            <div><strong>CONTEXT:</strong> {debugInfo.context}</div>
            <div><strong>Current Return URL:</strong> {debugInfo.currentReturnUrl}</div>
          </div>
        )}
      </div>
    </div>
  );
}