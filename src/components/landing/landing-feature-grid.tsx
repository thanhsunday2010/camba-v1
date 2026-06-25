"use client";

import { CambaCard } from "@/components/camba/primitives/camba-card";
import { AnimatedCard } from "@/components/camba/motion/animated-card";
import type { LandingFeature, LandingFeatureIcon } from "@/components/landing/landing-types";
import { BookOpen, Sparkles, FileText, Map, Trophy, Gift } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const FEATURE_ICONS: Record<LandingFeatureIcon, LucideIcon> = {
  bookOpen: BookOpen,
  sparkles: Sparkles,
  fileText: FileText,
  map: Map,
  trophy: Trophy,
  gift: Gift,
};

interface LandingFeatureGridProps {
  features: LandingFeature[];
}

export function LandingFeatureGrid({ features }: LandingFeatureGridProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {features.map((feature, index) => {
        const Icon = FEATURE_ICONS[feature.icon];
        return (
          <AnimatedCard key={feature.title} delay={index * 0.06} hoverLift>
            <CambaCard variant="elevated" padding="lg" className="h-full">
              <div className="space-y-3">
                <div className="camba-icon-box-md bg-program-muted text-program">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="camba-h3 text-foreground">{feature.title}</h3>
                <p className="camba-body text-muted leading-relaxed">{feature.description}</p>
              </div>
            </CambaCard>
          </AnimatedCard>
        );
      })}
    </div>
  );
}
