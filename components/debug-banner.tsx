"use client";

import { useState, useEffect } from "react";
import { getClientReturnUrl } from "@/lib/utils/url-utils";

interface DebugInfo {
  currentReturnUrl: string;
  deployPrimeUrl: string;
  deployUrl: string;
  url: string;
  context: string;
  deployId: string;
  siteName: string;
  vercelUrl: string;
  windowOrigin: string;
  hasWindow: boolean;
  nodeEnv: string;
}

export function DebugBanner() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [clientUrl, setClientUrl] = useState<string>("");

  // Fetch debug info from server-side API
  useEffect(() => {
    fetch("/api/debug/environment")
      .then((res) => res.json())
      .then(setDebugInfo)
      .catch(console.error);

    // Get client-side URL
    setClientUrl(getClientReturnUrl());
  }, []);

  if (!debugInfo) {
    return (
      <div className="hidden bg-yellow-400 text-black border-b-2 border-yellow-600">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="font-mono text-sm font-bold">
            🐛 DEBUG MODE - Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden bg-yellow-400 text-black border-b-2 border-yellow-600">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 font-mono text-sm font-bold w-full"
        >
          🐛 DEBUG MODE - Current URL: {debugInfo.currentReturnUrl}
          <span className="ml-auto">{isExpanded ? "▼" : "▶"}</span>
        </button>

        {isExpanded && (
          <div className="mt-2 p-3 bg-yellow-300 rounded font-mono text-xs space-y-1">
            <div className="mb-2 font-bold text-green-800">🎯 Final URLs:</div>
            <div>
              <strong>Server getReturnUrl():</strong>{" "}
              {debugInfo.currentReturnUrl}
            </div>
            <div>
              <strong>Client getClientReturnUrl():</strong> {clientUrl}
            </div>

            <div className="mt-3 mb-2 font-bold text-blue-800">
              🚀 Netlify URLs (Priority Order):
            </div>
            <div>
              <strong>DEPLOY_PRIME_URL:</strong> {debugInfo.deployPrimeUrl}
            </div>
            <div>
              <strong>DEPLOY_URL:</strong> {debugInfo.deployUrl}
            </div>
            <div>
              <strong>URL:</strong> {debugInfo.url}
            </div>

            <div className="mt-3 mb-2 font-bold text-purple-800">
              📍 Context Info:
            </div>
            <div>
              <strong>CONTEXT:</strong> {debugInfo.context}
            </div>
            <div>
              <strong>DEPLOY_ID:</strong> {debugInfo.deployId}
            </div>
            <div>
              <strong>SITE_NAME:</strong> {debugInfo.siteName}
            </div>

            <div className="mt-3 mb-2 font-bold text-orange-800">
              🌐 Browser Fallback:
            </div>
            <div>
              <strong>window.location.origin:</strong> {debugInfo.windowOrigin}
            </div>
            <div>
              <strong>Has window:</strong> {debugInfo.hasWindow ? "Yes" : "No"}
            </div>

            <div className="mt-3 mb-2 font-bold text-gray-800">🔧 Other:</div>
            <div>
              <strong>VERCEL_URL:</strong> {debugInfo.vercelUrl}
            </div>
            <div>
              <strong>NODE_ENV:</strong> {debugInfo.nodeEnv}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
