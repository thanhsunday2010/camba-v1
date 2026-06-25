import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/camba/section-header";
import { NextAchievementCard, type NextAchievementCardLabels } from "@/components/achievements/next-achievement-card";
import {
  AchievementShowcase,
  type AchievementShowcaseLabels,
} from "@/components/achievements/achievement-showcase";
import type { AchievementPortfolioSlice } from "@/lib/profile/student-profile-types";
import type { AchievementItemLabels } from "@/lib/achievements/achievement-i18n";
import { withAchievementText, withAchievementTexts } from "@/lib/achievements/achievement-i18n";
import { Award } from "lucide-react";

interface ProfileAchievementSectionProps {
  achievements: AchievementPortfolioSlice;
  achievementItemLabels: AchievementItemLabels;
  showcaseLabels: AchievementShowcaseLabels;
  nextLabels: NextAchievementCardLabels;
  rareTitle: string;
  rareSubtitle: string;
}

export function ProfileAchievementSection({
  achievements,
  achievementItemLabels,
  showcaseLabels,
  nextLabels,
  rareTitle,
  rareSubtitle,
}: ProfileAchievementSectionProps) {
  const recentUnlocked = withAchievementTexts(achievements.recentUnlocked, achievementItemLabels);
  const rareUnlocked = withAchievementTexts(achievements.rareUnlocked, achievementItemLabels);
  const nextAchievement = achievements.nextAchievement
    ? withAchievementText(achievements.nextAchievement, achievementItemLabels)
    : null;

  return (
    <section aria-labelledby="profile-achievements-heading" className="space-y-6">
      <AchievementShowcase
        achievements={recentUnlocked}
        unlockedCount={achievements.unlockedCount}
        totalCount={achievements.totalCount}
        labels={showcaseLabels}
      />

      {rareUnlocked.length > 0 && (
        <div>
          <SectionHeader
            titleId="profile-rare-achievements-heading"
            title={rareTitle}
            description={rareSubtitle}
            icon={Award}
          />
          <div className="grid gap-3 sm:grid-cols-3">
            {rareUnlocked.map((achievement) => (
                <Link
                  key={achievement.id}
                  href="/achievements"
                  className="rounded-2xl border border-[var(--color-badge)]/25 bg-[var(--color-badge)]/5 px-4 py-3 camba-focus-ring"
                >
                  <p className="camba-body font-semibold text-foreground">{achievement.title}</p>
                  <p className="camba-caption text-muted mt-1 capitalize">{achievement.rarity}</p>
                </Link>
              ))}
          </div>
        </div>
      )}

      <NextAchievementCard
        achievement={nextAchievement}
        labels={nextLabels}
      />
    </section>
  );
}
