"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Users, Calendar, Target } from "lucide-react";
import Link from "next/link";
import { NextSessionCard } from "@/components/home/next-session-card";

const benefits = [
  {
    icon: Trophy,
    title: "Elite Competition",
    description:
      "Face the best teams across Ontario and Quebec in high-level tournament play",
  },
  {
    icon: Users,
    title: "Team Building",
    description:
      "Develop chemistry and showcase your squad's talent on a bigger stage",
  },
  {
    icon: Calendar,
    title: "Flexible Schedule",
    description:
      "Choose from multiple session packages that fit your team's commitment level",
  },
  {
    icon: Target,
    title: "Championship Path",
    description:
      "Compete for regional titles and advance to the championship weekend",
  },
];

export function EmptyTabRecruit() {
  return (
    <div className="text-center py-0 space-y-12">
      {/* Hero Challenge */}
      <div className="">
        <div className="space-y-2">
          <h2 className="text-4xl font-normal text-foreground">
            Your Competition Awaits
          </h2>
        </div>

        <div className="flex justify-center">
          <NextSessionCard />
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {benefits.map((benefit, index) => {
          const Icon = benefit.icon;
          return (
            <Card
              key={index}
              className="border-0 bg-white"
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {benefit.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="bg-muted/50 rounded-lg p-8 space-y-4">
        <h3 className="text-xl font-bold text-foreground">
          Ready to Elevate Your Game?
        </h3>
        <p className="text-muted-foreground">
          Join the most competitive basketball circuit in the region. Register
          now and secure your spot.
        </p>
        <Button
          asChild
          variant="outline"
          size="lg"
        >
          <Link href="/register">Start Registration</Link>
        </Button>
      </div>
    </div>
  );
}
