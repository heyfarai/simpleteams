"use client";

import { useEffect, useState, useRef } from 'react';
import { toast } from 'sonner';

interface ServiceStatus {
  healthy: boolean;
  issues: string[];
}

export function useServiceStatus() {
  const [lastHealthy, setLastHealthy] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  const checkServices = async () => {
    if (isChecking) return;
    setIsChecking(true);

    try {
      const response = await fetch('/api/health');
      const status: ServiceStatus = await response.json();

      // Show toast when status changes from healthy to unhealthy
      if (!status.healthy && status.issues.length > 0 && lastHealthy) {
        toast.error('Service Issues Detected', {
          description: `${status.issues.length} service(s) unavailable: ${status.issues.join(', ')}`,
          duration: 10000,
          action: {
            label: 'Retry',
            onClick: () => window.location.reload()
          }
        });
      }

      // Show success toast when services come back online
      if (status.healthy && !lastHealthy) {
        toast.success('Services Restored', {
          description: 'All services are now available',
          duration: 5000
        });
      }

      setLastHealthy(status.healthy);
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Check on mount after a short delay
    const mountTimer = setTimeout(() => {
      checkServices();
    }, 2000);

    // Check every 2 minutes
    intervalRef.current = setInterval(checkServices, 120000);

    return () => {
      clearTimeout(mountTimer);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return { checkServices };
}