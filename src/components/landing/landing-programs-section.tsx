import { CambaCard } from "@/components/camba/primitives/camba-card";
import type { LandingProgram } from "@/components/landing/landing-types";

interface LandingProgramsSectionProps {
  title: string;
  programs: LandingProgram[];
}

export function LandingProgramsSection({ title, programs }: LandingProgramsSectionProps) {
  return (
    <section aria-labelledby="landing-programs-heading">
      <h2 id="landing-programs-heading" className="camba-h2 text-foreground mb-4">
        {title}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {programs.map((program) => (
          <CambaCard
            key={program.key}
            variant="hero"
            padding="md"
            className="h-full bg-white/80 border-program/20"
          >
            <div className="space-y-2">
              <span className="inline-flex rounded-full bg-program-muted px-2.5 py-0.5 camba-caption font-bold uppercase tracking-wide text-program">
                {program.badge}
              </span>
              <h3 className="camba-h3 text-foreground">{program.title}</h3>
            </div>
          </CambaCard>
        ))}
      </div>
    </section>
  );
}
