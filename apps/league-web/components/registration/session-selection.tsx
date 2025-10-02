"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Users, Clock } from "lucide-react";
import { useSessionOptions } from "@/lib/hooks/use-sessions";
import type { GameSession } from "@/lib/domain/models";

// Helper function to format date range
const formatDateRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Format options
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };

  // If same month, show "Nov 1-3"
  if (
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear()
  ) {
    if (start.getDate() === end.getDate()) {
      return start.toLocaleDateString("en-US", options);
    }
    return `${start
      .toLocaleDateString("en-US", options)
      .replace(/,.*/, "")} ${start.getDate()}-${end.getDate()}`;
  }

  // Different months, show "Dec 20 - Jan 2"
  return `${start.toLocaleDateString(
    "en-US",
    options
  )} - ${end.toLocaleDateString("en-US", options)}`;
};

interface SessionSelectionProps {
  packageType: "full-season" | "two-session" | "pay-per-session";
  seasonId?: string;
  selectedSessionIds?: string[];
  onSelectionChange: (sessionIds: string[]) => void;
  className?: string;
}

interface SessionOption {
  value: string;
  label: string;
  sequence: number;
  type: string;
  disabled: boolean;
  startDate: string;
  endDate: string;
  session?: GameSession;
}

export function SessionSelection({
  packageType,
  seasonId,
  selectedSessionIds = [],
  onSelectionChange,
  className,
}: SessionSelectionProps) {
  const [localSelection, setLocalSelection] =
    useState<string[]>(selectedSessionIds);
  const { sessionOptions, isLoading, error } = useSessionOptions(seasonId);

  // Update local selection when prop changes
  useEffect(() => {
    setLocalSelection(selectedSessionIds);
  }, [selectedSessionIds]);

  // Don't show for full-season packages
  if (packageType === "full-season") {
    return null;
  }

  const handleSessionToggle = (sessionId: string) => {
    const newSelection = localSelection.includes(sessionId)
      ? localSelection.filter((id) => id !== sessionId)
      : [...localSelection, sessionId];

    // Apply package-specific constraints
    let constrainedSelection = newSelection;

    if (packageType === "two-session") {
      // Limit to 2 sessions for two-session package
      constrainedSelection = newSelection.slice(-2);
    } else if (packageType === "pay-per-session") {
      // Limit to 1 session for pay-per-session package
      constrainedSelection = newSelection.slice(-1);
    }

    setLocalSelection(constrainedSelection);
    onSelectionChange(constrainedSelection);
  };

  const getSelectionValidation = () => {
    if (packageType === "two-session") {
      if (localSelection.length === 0) {
        return { isValid: false, message: "Please select 2 sessions" };
      }
      if (localSelection.length === 1) {
        return { isValid: false, message: "Please select 1 more session" };
      }
      if (localSelection.length === 2) {
        return { isValid: true, message: "2 sessions selected" };
      }
      return {
        isValid: false,
        message: "Only 2 sessions allowed for this package",
      };
    }

    if (packageType === "pay-per-session") {
      if (localSelection.length === 0) {
        return { isValid: false, message: "Please select 1 session" };
      }
      if (localSelection.length === 1) {
        return { isValid: true, message: "1 session selected" };
      }
      return {
        isValid: false,
        message: "Only 1 session allowed for this package",
      };
    }

    return { isValid: true, message: "" };
  };

  const validation = getSelectionValidation();

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Session Selection
          </CardTitle>
          <CardDescription>
            Choose which sessions you'd like to participate in
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2 text-sm text-muted-foreground">
              Loading sessions...
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Session Selection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-sm text-destructive">Failed to load sessions</p>
            <p className="text-xs text-muted-foreground mt-1">
              Please try refreshing the page
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Session Selection
        </CardTitle>
        <CardDescription>
          {packageType === "two-session" &&
            "Select exactly 2 sessions for your two-session package"}
          {packageType === "pay-per-session" &&
            "Select 1 session you want to participate in"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessionOptions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              No sessions available
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-3">
              {sessionOptions.map((session) => {
                const isSelected = localSelection.includes(session.value);
                const canSelect =
                  isSelected ||
                  (packageType === "two-session" && localSelection.length < 2) ||
                  (packageType === "pay-per-session" && localSelection.length < 1);

                return (
                  <div
                    key={session.value}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : canSelect
                        ? "border-border hover:border-primary/50"
                        : "border-border opacity-50 cursor-not-allowed"
                    }`}
                  >
                    <Checkbox
                      id={session.value}
                      checked={isSelected}
                      disabled={!canSelect}
                      onCheckedChange={() =>
                        canSelect && handleSessionToggle(session.value)
                      }
                    />
                    <div className="flex-1">
                      <label
                        htmlFor={session.value}
                        className={`flex items-center justify-between cursor-pointer ${
                          !canSelect ? "cursor-not-allowed" : ""
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {session.label}{" "}
                            </span>
                            <Badge
                              variant={
                                session.type === "playoffs"
                                  ? "secondary"
                                  : "outline"
                              }
                              className="text-xs"
                            >
                              {session.type}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Session {session.sequence} •{" "}
                              {formatDateRange(
                                session.startDate,
                                session.endDate
                              )}
                            </span>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selection Status */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm">
                <span
                  className={
                    validation.isValid
                      ? "text-success"
                      : "text-muted-foreground"
                  }
                >
                  {validation.message}
                </span>
              </div>
              {packageType === "two-session" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{localSelection.length}/2 selected</span>
                </div>
              )}
              {packageType === "pay-per-session" && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{localSelection.length}/1 selected</span>
                </div>
              )}
            </div>

            {/* Package Type Info */}
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Package Details</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                {packageType === "two-session" && (
                  <>
                    <p>• Select exactly 2 sessions</p>
                    <p>• Each session includes multiple games</p>
                    <p>• Great for trying out different competition levels</p>
                  </>
                )}
                {packageType === "pay-per-session" && (
                  <>
                    <p>• Select exactly 1 session</p>
                    <p>• Pay only for the session you participate in</p>
                    <p>• Perfect for trying out the league</p>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
