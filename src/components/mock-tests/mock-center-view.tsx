import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/camba/section-header";
import { MockTestEmptyState } from "@/components/mock-tests/mock-test-empty-state";
import { PremiumMockCard, type PremiumMockCardLabels } from "@/components/mock-tests/premium-mock-card";
import { MockAiSkillBadges } from "@/components/mock-tests/mock-ai-skill-badges";
import { deriveMockDifficulty } from "@/lib/mock-tests/mock-center-utils";
import type { MockCenterViewModel } from "@/lib/mock-tests/mock-center-utils";
import { MockCenterAchievementPreview } from "@/components/mock-tests/mock-center-achievement-preview";
import { PortfolioLink } from "@/components/profile/portfolio-link";
import { AnimatedSection } from "@/components/camba/motion";
import type { AchievementCardLabels } from "@/components/achievements/achievement-card";
import type { NextAchievementCardLabels } from "@/components/achievements/next-achievement-card";
import type { MockTestHubSummary } from "@/lib/mock-tests/mock-test-types";
import {
  Award,
  ClipboardList,
  Play,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export interface MockCenterLabels {
  pageTitle: string;
  pageSubtitle: string;
  viewPortfolio?: string;
  assessmentCenterLabel: string;
  card: PremiumMockCardLabels;
  hero: {
    featuredLabel: string;
    levelMatch: string;
    startTest: string;
    viewDetail: string;
    difficultyStandard: string;
    difficultyReview: string;
    difficultyChallenge: string;
  };
  continue: {
    title: string;
    subtitle: string;
    resume: string;
  };
  recommended: {
    title: string;
    subtitle: string;
    whyRecommended: string;
    levelMatch: string;
    readiness: string;
  };
  gold: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyAction: string;
    certifiedDate: string;
  };
  levels: {
    title: string;
    subtitle: string;
    completed: string;
    recommendedNext: string;
    emptyLevel: string;
  };
  readiness: {
    title: string;
    subtitle: string;
    currentReadiness: string;
    strongest: string;
    weakest: string;
    focus: string;
    recommendedLevel: string;
    building: string;
    developing: string;
    approaching: string;
    ready: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyAction: string;
  };
  recent: {
    title: string;
    subtitle: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyAction: string;
    writing: string;
    speaking: string;
    viewDetail: string;
  };
  empty: {
    title: string;
    description: string;
  };
  achievements: {
    title: string;
    subtitle: string;
  };
  achievementCard: AchievementCardLabels;
  achievementNext: NextAchievementCardLabels;
  achievementItemLabels: Record<string, { title: string; description: string }>;
}

function difficultyText(test: MockTestHubSummary, labels: MockCenterLabels["hero"]) {
  switch (deriveMockDifficulty(test)) {
    case "review":
      return labels.difficultyReview;
    case "challenge":
      return labels.difficultyChallenge;
    default:
      return labels.difficultyStandard;
  }
}

function readinessText(band: MockCenterViewModel["readiness"]["readinessBand"], labels: MockCenterLabels["readiness"]) {
  switch (band) {
    case "ready":
      return labels.ready;
    case "approaching":
      return labels.approaching;
    case "developing":
      return labels.developing;
    default:
      return labels.building;
  }
}

function MockCenterHero({
  test,
  labels,
}: {
  test: MockTestHubSummary;
  labels: MockCenterLabels;
}) {
  const takeHref = `/mock-tests/${test.id}/take`;
  const detailHref = `/mock-tests/${test.id}`;

  return (
    <AnimatedSection>
    <section
      aria-labelledby="mock-center-featured-heading"
      className="relative overflow-hidden rounded-3xl border-2 border-[var(--status-mock-test)]/30 bg-gradient-to-br from-[var(--status-mock-test)]/12 via-white to-[var(--color-badge)]/5 p-5 sm:p-8 shadow-md"
    >
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-20 blur-3xl bg-[var(--status-mock-test)]"
        aria-hidden
      />
      <div className="relative space-y-4">
        <p
          id="mock-center-featured-heading"
          className="camba-caption font-bold uppercase tracking-wide text-[var(--status-mock-test)] flex items-center gap-1.5"
        >
          <Star className="h-4 w-4" aria-hidden />
          {labels.hero.featuredLabel}
        </p>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div className="min-w-0 space-y-3">
            <h2 className="camba-display text-foreground">{test.title}</h2>
            {test.description && (
              <p className="camba-body text-muted max-w-2xl">{test.description}</p>
            )}
            <div className="flex flex-wrap gap-2 camba-caption">
              {test.levelName && (
                <span className="rounded-full bg-program-muted px-2.5 py-1 font-semibold text-program">
                  {test.levelName}
                </span>
              )}
              {test.isRecommendedForLearner && (
                <span className="rounded-full bg-white/80 border border-program/20 px-2.5 py-1 font-semibold text-program">
                  {labels.hero.levelMatch}
                </span>
              )}
              <span className="rounded-full bg-[var(--surface-sunken)] px-2.5 py-1 font-medium text-muted">
                {difficultyText(test, labels.hero)}
              </span>
            </div>
            <MockAiSkillBadges
              format={test.format}
              isGoldMock={test.isGoldMock}
              labels={{
                goldCertified: labels.card.goldBadge,
                writingAi: labels.card.writingAi,
                speakingAi: labels.card.speakingAi,
              }}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <Button variant="quest" size="lg" asChild>
              <Link href={takeHref}>
                <Play className="h-4 w-4 mr-1" aria-hidden />
                {labels.hero.startTest}
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href={detailHref}>{labels.hero.viewDetail}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
    </AnimatedSection>
  );
}

export function MockCenterView({
  model,
  labels,
}: {
  model: MockCenterViewModel;
  labels: MockCenterLabels;
}) {
  if (model.hub.tests.length === 0) {
    return (
      <MockTestEmptyState title={labels.empty.title} description={labels.empty.description} />
    );
  }

  return (
    <div className="camba-section-stack gap-8 sm:gap-10">
      <header className="space-y-2">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 space-y-2 flex-1">
            <div className="flex items-center gap-2 text-[var(--status-mock-test)]">
              <ClipboardList className="h-6 w-6" aria-hidden />
              <span className="camba-caption font-bold uppercase tracking-wide">
                {labels.assessmentCenterLabel}
              </span>
            </div>
            <h1 className="camba-display text-foreground">{labels.pageTitle}</h1>
            <p className="camba-body text-muted max-w-2xl">{labels.pageSubtitle}</p>
          </div>
          {labels.viewPortfolio && <PortfolioLink label={labels.viewPortfolio} />}
        </div>
      </header>

      {model.featuredMock && (
        <MockCenterHero test={model.featuredMock} labels={labels} />
      )}

      {model.continueMock && (
        <section aria-labelledby="continue-mock-heading">
          <SectionHeader
            titleId="continue-mock-heading"
            title={labels.continue.title}
            description={labels.continue.subtitle}
            icon={RotateCcw}
          />
          <PremiumMockCard test={model.continueMock} labels={labels.card} />
        </section>
      )}

      {model.recommendedMock && model.recommendedMock.id !== model.featuredMock?.id && (
        <section aria-labelledby="recommended-mock-heading">
          <SectionHeader
            titleId="recommended-mock-heading"
            title={labels.recommended.title}
            description={labels.recommended.subtitle.replace(
              "{level}",
              model.hub.currentLearnerLevelName ?? "your level"
            )}
            icon={Target}
          />
          <div className="rounded-2xl border border-program/20 bg-program-muted/20 p-4 mb-4 camba-caption text-muted space-y-1">
            <p>{labels.recommended.whyRecommended}</p>
            {model.hub.currentLearnerLevelName && (
              <p className="font-semibold text-program">
                {labels.recommended.levelMatch}: {model.hub.currentLearnerLevelName}
              </p>
            )}
            <p>
              {labels.recommended.readiness}: {model.readiness.readinessPercent}% ·{" "}
              {readinessText(model.readiness.readinessBand, labels.readiness)}
            </p>
          </div>
          <PremiumMockCard test={model.recommendedMock} labels={labels.card} />
        </section>
      )}

      <section aria-labelledby="gold-mocks-heading">
        <SectionHeader
          titleId="gold-mocks-heading"
          title={labels.gold.title}
          description={labels.gold.subtitle}
          icon={Award}
        />
        {model.goldMocks.length === 0 ? (
          <MockTestEmptyState
            title={labels.gold.emptyTitle}
            description={labels.gold.emptyDescription}
            actionLabel={labels.gold.emptyAction}
            actionHref="/mock-tests"
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {model.goldMocks.map((test) => (
              <PremiumMockCard key={test.id} test={test} labels={labels.card} />
            ))}
          </div>
        )}
      </section>

      {model.levelCollections.length > 0 && (
        <section aria-labelledby="level-collections-heading">
          <SectionHeader
            titleId="level-collections-heading"
            title={labels.levels.title}
            description={labels.levels.subtitle}
            icon={Sparkles}
          />
          <div className="space-y-6">
            {model.levelCollections.map((collection) => (
              <div
                key={collection.slug}
                className="rounded-2xl border border-border/60 bg-white/80 p-4 sm:p-5 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="camba-h2 text-foreground">{collection.name}</h3>
                  <span className="camba-caption text-muted font-semibold">
                    {labels.levels.completed}: {collection.completedCount}/{collection.totalCount}
                  </span>
                </div>
                {collection.recommendedNext && (
                  <p className="camba-caption text-program font-medium">
                    {labels.levels.recommendedNext}: {collection.recommendedNext.title}
                  </p>
                )}
                {collection.tests.length === 0 ? (
                  <p className="camba-caption text-muted">{labels.levels.emptyLevel}</p>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {collection.tests.slice(0, 4).map((test) => (
                      <PremiumMockCard key={test.id} test={test} labels={labels.card} compact />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="readiness-heading">
        <SectionHeader
          titleId="readiness-heading"
          title={labels.readiness.title}
          description={labels.readiness.subtitle}
          icon={TrendingUp}
        />
        {!model.readiness.hasAnalytics ? (
          <MockTestEmptyState
            title={labels.readiness.emptyTitle}
            description={labels.readiness.emptyDescription}
            actionLabel={labels.readiness.emptyAction}
            actionHref="/mock-tests"
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 camba-caption">
            <div className="rounded-xl border border-border/60 bg-white p-4">
              <p className="text-muted">{labels.readiness.currentReadiness}</p>
              <p className="camba-stat text-[var(--status-mock-test)] mt-1">
                {model.readiness.readinessPercent}%
              </p>
              <p className="font-semibold text-foreground mt-1">
                {readinessText(model.readiness.readinessBand, labels.readiness)}
              </p>
            </div>
            {model.readiness.strongestSkill && (
              <div className="rounded-xl border border-success/25 bg-success/5 p-4">
                <p className="text-muted">{labels.readiness.strongest}</p>
                <p className="font-semibold text-foreground mt-1 capitalize">
                  {model.readiness.strongestSkill}
                </p>
              </div>
            )}
            {model.readiness.weakestSkill && (
              <div className="rounded-xl border border-[var(--status-needs-review)]/25 bg-orange-50/50 p-4">
                <p className="text-muted">{labels.readiness.weakest}</p>
                <p className="font-semibold text-foreground mt-1 capitalize">
                  {model.readiness.weakestSkill}
                </p>
              </div>
            )}
            {model.readiness.recommendedLevelName && (
              <div className="rounded-xl border border-program/25 bg-program-muted/30 p-4">
                <p className="text-muted">{labels.readiness.recommendedLevel}</p>
                <p className="font-semibold text-foreground mt-1">
                  {model.readiness.recommendedLevelName}
                </p>
                {model.readiness.suggestedFocus && (
                  <p className="text-muted mt-2">
                    {labels.readiness.focus}:{" "}
                    <span className="capitalize">{model.readiness.suggestedFocus}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </section>

      <section aria-labelledby="recent-results-heading">
        <SectionHeader
          titleId="recent-results-heading"
          title={labels.recent.title}
          description={labels.recent.subtitle}
          icon={ClipboardList}
        />
        {model.recentResults.length === 0 ? (
          <MockTestEmptyState
            title={labels.recent.emptyTitle}
            description={labels.recent.emptyDescription}
            actionLabel={labels.recent.emptyAction}
            actionHref="/mock-tests"
          />
        ) : (
          <ol className="space-y-2" aria-label={labels.recent.title}>
            {model.recentResults.map((result) => (
              <li key={result.attemptId}>
                <Link
                  href={result.detailHref}
                  className="block rounded-xl border border-border/60 bg-white px-4 py-3 hover:border-[var(--status-mock-test)]/30 camba-focus-ring transition-colors"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="camba-body font-semibold text-foreground truncate">
                        {result.mockTitle}
                      </p>
                      <p className="camba-caption text-muted">
                        {result.levelName ?? "—"} ·{" "}
                        {new Date(result.completedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <span className="camba-stat text-[var(--status-mock-test)]">
                      {result.scorePercent}%
                    </span>
                  </div>
                  {(result.writingScorePercent != null || result.speakingScorePercent != null) && (
                    <p className="camba-caption text-muted mt-1">
                      {result.writingScorePercent != null &&
                        `${labels.recent.writing}: ${result.writingScorePercent}%`}
                      {result.writingScorePercent != null &&
                        result.speakingScorePercent != null &&
                        " · "}
                      {result.speakingScorePercent != null &&
                        `${labels.recent.speaking}: ${result.speakingScorePercent}%`}
                    </p>
                  )}
                </Link>
              </li>
            ))}
          </ol>
        )}
      </section>

      {(model.achievementPreview.recentUnlocked.length > 0 ||
        model.achievementPreview.nextAchievement) && (
        <MockCenterAchievementPreview
          recentUnlocked={model.achievementPreview.recentUnlocked}
          nextAchievement={model.achievementPreview.nextAchievement}
          itemLabels={labels.achievementItemLabels}
          cardLabels={labels.achievementCard}
          nextLabels={labels.achievementNext}
          labels={{
            title: labels.achievements.title,
            subtitle: labels.achievements.subtitle,
          }}
        />
      )}
    </div>
  );
}
