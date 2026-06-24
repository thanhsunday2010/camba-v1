import type { DailyMissionItem } from "@/components/gamification/daily-missions";
import type { NextLessonContext, SkillProgressRow } from "@/lib/queries/dashboard";
import type { MockTestHubSummary } from "@/lib/mock-tests/mock-test-types";
import { pickRecommendedMock } from "@/lib/mock-tests/mock-center-utils";

export type DailyMissionKind =
  | "daily_mission"
  | "continue_lesson"
  | "mock_test"
  | "skill_review";

export type DashboardDailyMission = {
  kind: DailyMissionKind;
  title: string;
  description: string;
  href: string;
  ctaLabel: string;
  progressLabel?: string;
  progressPercent?: number;
};

export { pickRecommendedMock } from "@/lib/mock-tests/mock-center-utils";

function pickWeakestSkill(skills: SkillProgressRow[]): SkillProgressRow | null {
  const withData = skills.filter((s) => s.progressPercent >= 0);
  if (!withData.length) return null;
  return [...withData].sort((a, b) => a.progressPercent - b.progressPercent)[0] ?? null;
}

function pickIncompleteMission(missions: DailyMissionItem[]): DailyMissionItem | null {
  const open = missions.filter((m) => !m.isCompleted);
  if (!open.length) return null;
  return [...open].sort((a, b) => b.xpReward - a.xpReward || a.title.localeCompare(b.title))[0] ?? null;
}

export function pickDailyMission(input: {
  missions: DailyMissionItem[];
  nextLesson: NextLessonContext | null;
  recommendedMocks: MockTestHubSummary[];
  skillSnapshot: SkillProgressRow[];
  labels: {
    completeMission: string;
    continueLesson: string;
    takeMock: string;
    reviewSkill: string;
    startLearning: string;
    viewMock: string;
    skillReviewDesc: string;
  };
  skillLabels: Record<string, string>;
}): DashboardDailyMission | null {
  const mission = pickIncompleteMission(input.missions);
  if (mission) {
    const progressPercent =
      mission.targetValue > 0
        ? Math.min(100, Math.round((mission.currentValue / mission.targetValue) * 100))
        : 0;
    return {
      kind: "daily_mission",
      title: mission.title,
      description: mission.description ?? mission.title,
      href: "/learning",
      ctaLabel: input.labels.completeMission,
      progressLabel: `${mission.currentValue}/${mission.targetValue}`,
      progressPercent,
    };
  }

  if (input.nextLesson && input.nextLesson.completionPercent < 100) {
    return {
      kind: "continue_lesson",
      title: input.nextLesson.title,
      description: input.nextLesson.unitTitle ?? input.labels.continueLesson,
      href: `/learning/lesson/${input.nextLesson.id}`,
      ctaLabel: input.labels.continueLesson,
      progressPercent: input.nextLesson.completionPercent,
    };
  }

  const mock = pickRecommendedMock(input.recommendedMocks);
  if (mock) {
    return {
      kind: "mock_test",
      title: mock.title,
      description: mock.description ?? input.labels.takeMock,
      href: `/mock-tests/${mock.id}`,
      ctaLabel: input.labels.viewMock,
    };
  }

  const weakSkill = pickWeakestSkill(input.skillSnapshot);
  if (weakSkill && weakSkill.progressPercent < 55) {
    const skillName = input.skillLabels[weakSkill.slug] ?? weakSkill.name;
    return {
      kind: "skill_review",
      title: input.labels.reviewSkill.replace("{skill}", skillName),
      description: input.labels.skillReviewDesc.replace("{skill}", skillName),
      href: "/learning",
      ctaLabel: input.labels.startLearning,
      progressPercent: weakSkill.progressPercent,
    };
  }

  return {
    kind: "continue_lesson",
    title: input.labels.startLearning,
    description: input.labels.continueLesson,
    href: "/learning",
    ctaLabel: input.labels.startLearning,
  };
}
