import { CambaCard } from "@/components/camba/primitives/camba-card";
import { SectionHeader } from "@/components/camba/section-header";
import type { LandingProgram } from "@/components/landing/landing-types";
import { GraduationCap } from "lucide-react";

interface LandingProgramsSectionProps {
  title: string;
  subtitle: string;
  programs: LandingProgram[];
}

export function LandingProgramsSection({ title, subtitle, programs }: LandingProgramsSectionProps) {
  return (
    <section aria-labelledby="landing-programs-heading">
      <SectionHeader
        titleId="landing-programs-heading"
        title={title}
        description={subtitle}
        icon={GraduationCap}
        className="mb-6"
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {programs.map((program) => (
          <CambaCard
            key={program.key}
            variant="hero"
            padding="lg"
            className="h-full bg-white/80 border-program/20"
          >
            <div className="space-y-3">
              <span className="inline-flex rounded-full bg-program-muted px-2.5 py-0.5 camba-caption font-bold uppercase tracking-wide text-program">
                {program.badge}
              </span>
              <h3 className="camba-h3 text-foreground">{program.title}</h3>
              <p className="camba-body text-muted leading-relaxed">{program.description}</p>
            </div>
          </CambaCard>
        ))}
      </div>
    </section>
  );
}
