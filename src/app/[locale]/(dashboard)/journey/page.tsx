import { getTranslations } from "next-intl/server";
import { requireCurrentUser } from "@/lib/auth/current-user";
import { redirectToPath } from "@/lib/auth/navigation";
import { getLearningJourneyViewModel } from "@/lib/learning/journey/learning-journey-view-model";
import { getJourneyAchievementPreview } from "@/lib/achievements/achievement-view-model";
import { buildSharedAchievementLabels } from "@/lib/achievements/achievement-i18n";
import { JourneyView } from "@/components/journey/journey-view";
import { fetchActiveProgramContext, fetchLevelsForProgram } from "@/actions/programs";
import { getUserGamification } from "@/lib/queries/user";

export const dynamic = "force-dynamic";

export default async function JourneyPage() {
  const user = await requireCurrentUser();

  const t = await getTranslations("journey");
  const tp = await getTranslations("programs");
  const ta = await getTranslations("achievements");

  const gamification = await getUserGamification(user.id);
  const programContext = await fetchActiveProgramContext(gamification);

  const programId = programContext?.programId;
  if (!programId) {
    await redirectToPath("/settings");
    throw new Error("Unreachable");
  }

  const [journeyModel, levels, journeyAchievementPreview] = await Promise.all([
    getLearningJourneyViewModel(user.id, t("nextMilestoneFallback")),
    fetchLevelsForProgram(programId),
    getJourneyAchievementPreview(user.id),
  ]);

  if (!journeyModel) {
    await redirectToPath("/settings");
    throw new Error("Unreachable");
  }

  const levelCompleteLabels = {
    starters: t("milestoneLevelComplete.starters"),
    movers: t("milestoneLevelComplete.movers"),
    flyers: t("milestoneLevelComplete.flyers"),
    ket: t("milestoneLevelComplete.ket"),
    pet: t("milestoneLevelComplete.pet"),
  };

  const levelCompleteDescLabels = {
    starters: t("milestoneLevelCompleteDesc.starters"),
    movers: t("milestoneLevelCompleteDesc.movers"),
    flyers: t("milestoneLevelCompleteDesc.flyers"),
    ket: t("milestoneLevelCompleteDesc.ket"),
    pet: t("milestoneLevelCompleteDesc.pet"),
  };

  const achievementShared = buildSharedAchievementLabels(ta);

  return (
    <JourneyView
      model={journeyModel}
      levels={levels}
      journeyAchievements={journeyAchievementPreview.achievements}
      achievementItemLabels={achievementShared.itemLabels}
      labels={{
        pageTitle: t("pageTitle"),
        pageSubtitle: t("pageSubtitle"),
        viewPortfolio: t("viewPortfolio"),
        summary: {
          title: t("summaryTitle"),
          currentLevel: t("summaryCurrentLevel"),
          currentUnit: t("summaryCurrentUnit"),
          completion: t("summaryCompletion"),
          lessons: t("summaryLessons"),
          mocks: t("summaryMocks"),
          xp: t("summaryXp"),
          readiness: t("summaryReadiness"),
          readinessBuilding: t("readinessBuilding"),
          readinessDeveloping: t("readinessDeveloping"),
          readinessApproaching: t("readinessApproaching"),
          readinessReady: t("readinessReady"),
          nextMilestone: t("summaryNextMilestone"),
        },
        levels: {
          lessons: t("levelLessons"),
          mocks: t("levelMocks"),
          writing: t("levelWriting"),
          speaking: t("levelSpeaking"),
          currentPosition: t("levelCurrentPosition"),
          statusCompleted: t("statusCompleted"),
          statusCurrent: t("statusCurrent"),
          statusInProgress: t("statusInProgress"),
          statusUpcoming: t("statusUpcoming"),
          statusNotStarted: t("statusNotStarted"),
          openLevel: t("openLevel"),
        },
        roadmap: {
          unitLabel: t("roadmapUnitLabel"),
          mockCheckpoint: t("roadmapMockCheckpoint"),
          statusCompleted: t("roadmapStatusCompleted"),
          statusCurrent: t("roadmapStatusCurrent"),
          statusLocked: t("roadmapStatusLocked"),
          statusUpcoming: t("roadmapStatusUpcoming"),
          lessonsProgress: t("roadmapLessonsProgress"),
          continueUnit: t("roadmapContinueUnit"),
        },
        mocks: {
          title: t("mockSectionTitle"),
          recommended: t("mockRecommended"),
          completed: t("mockCompleted"),
          goldBadge: t("mockGoldBadge"),
          writingBadge: t("mockWritingBadge"),
          speakingBadge: t("mockSpeakingBadge"),
          viewMock: t("mockView"),
          emptyTitle: t("mockEmptyTitle"),
          emptyDescription: t("mockEmptyDescription"),
        },
        milestones: {
          title: t("milestonesTitle"),
          subtitle: t("milestonesSubtitle"),
          achieved: t("milestoneAchieved"),
          upcoming: t("milestoneUpcoming"),
          milestoneLevelComplete: levelCompleteLabels,
          milestoneLevelCompleteDesc: levelCompleteDescLabels,
          milestoneFirstWriting: t("milestoneFirstWriting"),
          milestoneFirstWritingDesc: t("milestoneFirstWritingDesc"),
          milestoneFirstSpeaking: t("milestoneFirstSpeaking"),
          milestoneFirstSpeakingDesc: t("milestoneFirstSpeakingDesc"),
          milestoneFirstGoldMock: t("milestoneFirstGoldMock"),
          milestoneFirstGoldMockDesc: t("milestoneFirstGoldMockDesc"),
          milestoneKetReady: t("milestoneKetReady"),
          milestoneKetReadyDesc: t("milestoneKetReadyDesc"),
          milestonePetReady: t("milestonePetReady"),
          milestonePetReadyDesc: t("milestonePetReadyDesc"),
        },
        levelPathTitle: t("levelPathTitle"),
        levelPathSubtitle: t("levelPathSubtitle"),
        unitRoadmapTitle: t("unitRoadmapTitle"),
        unitRoadmapSubtitle: t("unitRoadmapSubtitle"),
        mockSectionTitle: t("mockSectionTitle"),
        mockSectionSubtitle: t("mockSectionSubtitle"),
        noLevelTitle: t("noLevelTitle"),
        noLevelDesc: t("noLevelDesc"),
        levelSwitcher: {
          title: tp("levelTitle"),
          selecting: tp("selecting"),
          current: tp("currentLevel"),
        },
        achievements: {
          ...achievementShared,
          title: ta("journeyTitle"),
          subtitle: ta("journeySubtitle"),
          viewAll: ta("viewAll"),
          linkedMilestone: ta("relatedMilestone"),
        },
      }}
    />
  );
}
