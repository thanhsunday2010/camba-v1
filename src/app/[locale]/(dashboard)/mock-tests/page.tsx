import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { StudentPageShell } from "@/components/camba";
import { getMockCenterViewModel } from "@/lib/mock-tests/mock-center-view-model";
import { buildMockTestPageLabels } from "@/lib/mock-tests/mock-test-labels";
import { MockCenterView, type MockCenterLabels } from "@/components/mock-tests/mock-center-view";

import { buildSharedAchievementLabels } from "@/lib/achievements/achievement-i18n";

export default async function MockTestsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [labels, tmc, ta, model] = await Promise.all([
    buildMockTestPageLabels(),
    getTranslations("mockCenter"),
    getTranslations("achievements"),
    getMockCenterViewModel(user.id),
  ]);

  const achievementShared = buildSharedAchievementLabels(ta);

  const centerLabels: MockCenterLabels = {
    pageTitle: tmc("pageTitle"),
    pageSubtitle: tmc("pageSubtitle"),
    viewPortfolio: tmc("viewPortfolio"),
    assessmentCenterLabel: tmc("assessmentCenterLabel"),
    card: {
      ...labels.hub,
      goldBadge: tmc("goldBadge"),
      writingAi: tmc("writingAi"),
      speakingAi: tmc("speakingAi"),
      difficultyStandard: tmc("difficultyStandard"),
      difficultyReview: tmc("difficultyReview"),
      difficultyChallenge: tmc("difficultyChallenge"),
      startTest: labels.detail.startTest,
      resumeTest: tmc("resumeTest"),
      retakeTest: labels.detail.retakeTest,
    },
    hero: {
      featuredLabel: tmc("featuredLabel"),
      levelMatch: tmc("levelMatch"),
      startTest: labels.detail.startTest,
      viewDetail: labels.hub.viewDetail,
      difficultyStandard: tmc("difficultyStandard"),
      difficultyReview: tmc("difficultyReview"),
      difficultyChallenge: tmc("difficultyChallenge"),
    },
    continue: {
      title: tmc("continueTitle"),
      subtitle: tmc("continueSubtitle"),
      resume: tmc("resumeTest"),
    },
    recommended: {
      title: tmc("recommendedTitle"),
      subtitle: tmc("recommendedSubtitle"),
      whyRecommended: tmc("whyRecommended"),
      levelMatch: tmc("levelMatch"),
      readiness: tmc("readinessLabel"),
    },
    gold: {
      title: tmc("goldTitle"),
      subtitle: tmc("goldSubtitle"),
      emptyTitle: tmc("goldEmptyTitle"),
      emptyDescription: tmc("goldEmptyDescription"),
      certifiedDate: tmc("certifiedDate"),
    },
    levels: {
      title: tmc("levelsTitle"),
      subtitle: tmc("levelsSubtitle"),
      completed: tmc("levelsCompleted"),
      recommendedNext: tmc("levelsRecommendedNext"),
      emptyLevel: tmc("levelsEmpty"),
    },
    readiness: {
      title: tmc("readinessTitle"),
      subtitle: tmc("readinessSubtitle"),
      currentReadiness: tmc("currentReadiness"),
      strongest: tmc("strongestSkill"),
      weakest: tmc("weakestSkill"),
      focus: tmc("suggestedFocus"),
      recommendedLevel: tmc("recommendedLevel"),
      building: tmc("readinessBuilding"),
      developing: tmc("readinessDeveloping"),
      approaching: tmc("readinessApproaching"),
      ready: tmc("readinessReady"),
      emptyTitle: tmc("readinessEmptyTitle"),
      emptyDescription: tmc("readinessEmptyDescription"),
    },
    recent: {
      title: tmc("recentTitle"),
      subtitle: tmc("recentSubtitle"),
      emptyTitle: tmc("recentEmptyTitle"),
      emptyDescription: tmc("recentEmptyDescription"),
      writing: tmc("writingScore"),
      speaking: tmc("speakingScore"),
      viewDetail: labels.hub.viewDetail,
    },
    empty: {
      title: labels.hub.emptyTitle,
      description: labels.hub.emptyDescription,
    },
    achievements: {
      title: ta("mockCenterTitle"),
      subtitle: ta("mockCenterSubtitle"),
    },
    achievementCard: achievementShared,
    achievementNext: {
      title: ta("nextTitle"),
      subtitle: ta("nextSubtitle"),
      progressRemaining: ta("progressRemaining"),
      progressComplete: ta("progressComplete"),
      viewAchievements: ta("viewAll"),
      emptyTitle: ta("nextEmptyTitle"),
      emptyDescription: ta("nextEmptyDescription"),
      emptyAction: ta("showcaseEmptyAction"),
    },
    achievementItemLabels: achievementShared.itemLabels,
  };

  return (
    <StudentPageShell narrow>
      <MockCenterView model={model} labels={centerLabels} />
    </StudentPageShell>
  );
}
