import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/camba/section-header";
import { NextAchievementCard, type NextAchievementCardLabels } from "@/components/achievements/next-achievement-card";
import {
  AchievementShowcase,
  type AchievementShowcaseLabels,
} from "@/components/achievements/achievement-showcase";
import type { EvaluatedAchievement } from "@/lib/achievements/achievement-types";
import type { AchievementPortfolioSlice } from "@/lib/profile/student-profile-types";
import { Award } from "lucide-react";

interface ProfileAchievementSectionProps {
  achievements: AchievementPortfolioSlice;
  showcaseLabels: AchievementShowcaseLabels;
  nextLabels: NextAchievementCardLabels;
  resolveText: (achievement: EvaluatedAchievement) => { title: string; description: string };
  rareTitle: string;
  rareSubtitle: string;
}

export function ProfileAchievementSection({
  achievements,
  showcaseLabels,
  nextLabels,
  resolveText,
  rareTitle,
  rareSubtitle,
}: ProfileAchievementSectionProps) {
  return (
    <section aria-labelledby="profile-achievements-heading" className="space-y-6">
      <AchievementShowcase
        achievements={achievements.recentUnlocked}
        unlockedCount={achievements.unlockedCount}
        totalCount={achievements.totalCount}
        labels={showcaseLabels}
        resolveText={resolveText}
      />

      {achievements.rareUnlocked.length > 0 && (
        <div>
          <SectionHeader
            titleId="profile-rare-achievements-heading"
            title={rareTitle}
            description={rareSubtitle}
            icon={Award}
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {achievements.rareUnlocked.map((achievement) => {
              const text = resolveText(achievement);
              return (
                <Link
                  key={achievement.id}
                  href="/achievements"
                  className="rounded-2xl border border-[var(--color-badge)]/25 bg-[var(--color-badge)]/5 px-4 py-3 camba-focus-ring"
                >
                  <p className="camba-body font-semibold text-foreground">{text.title}</p>
                  <p className="camba-caption text-muted mt-1 capitalize">{achievement.rarity}</p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <NextAchievementCard
        achievement={achievements.nextAchievement}
        labels={nextLabels}
        resolveText={resolveText}
      />
    </section>
  );
}
