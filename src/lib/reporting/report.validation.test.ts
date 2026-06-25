import { describe, expect, it } from "vitest";
import {
  buildLearningProgressSummary,
  buildNextStepsSummary,
  buildParentProgressSnapshot,
  buildStudentProgressReportViewModel,
  deriveConsistency,
} from "@/lib/reporting/report-utils";
import type { StudentProgressReportLabels } from "@/lib/reporting/report-labels";
import type { StudentPortfolioViewModel } from "@/lib/profile/student-profile-types";
import type { DashboardSkillInsightsView } from "@/lib/dashboard/skill-insights";

const minimalLabels: StudentProgressReportLabels = {
  reportTitle: "Report",
  reportSubtitle: "Subtitle",
  snapshotTitle: "Snapshot",
  generatedOn: "Generated",
  studentLabel: "Student",
  levelLabel: "Level",
  streakLabel: "Streak",
  lessonsLabel: "Lessons",
  unitsLabel: "Units",
  mocksLabel: "Mocks",
  latestActivityLabel: "Activity",
  journeyLabel: "Journey",
  learningTitle: "Learning",
  mockTitle: "Mock",
  writingTitle: "Writing",
  speakingTitle: "Speaking",
  skillsTitle: "Skills",
  achievementsTitle: "Achievements",
  journeyTitle: "Journey",
  nextStepsTitle: "Next",
  strengthsLabel: "Strong",
  needsPracticeLabel: "Practice",
  averageLabel: "Average",
  bestScoreLabel: "Best",
  latestScoreLabel: "Latest",
  readinessLabel: "Ready",
  consistencyLabel: "Consistency",
  sectionEmpty: "Empty",
  gettingStartedTitle: "Start",
  gettingStartedBody: "Body",
  learningEmpty: "No learning",
  mockEmpty: "No mock",
  writingEmpty: "No writing",
  speakingEmpty: "No speaking",
  skillsEmpty: "No skills",
  achievementsEmpty: "No achievements",
  journeyEmpty: "No journey",
  nextStepsEmpty: "No steps",
  recentActivityTemplate: "Recent: {activity}",
  consistency: {
    consistent: "Consistent",
    returning: "Returning",
    "getting-started": "Starting",
  },
  trends: { improving: "Up", stable: "Stable", building: "Building" },
  readinessBands: {
    building: "Building",
    developing: "Developing",
    approaching: "Approaching",
    ready: "Ready",
  },
  nextSteps: {
    continueLesson: "Continue {lesson}",
    continueLessonReason: "Reason",
    startLearning: "Start",
    startLearningReason: "Reason",
    takeMock: "Mock {mock}",
    takeMockReason: "Reason",
    practiceWriting: "Write",
    practiceWritingReason: "Reason",
    reviewWriting: "Review {area}",
    reviewWritingReason: "Reason",
    practiceSpeaking: "Speak",
    practiceSpeakingReason: "Reason",
    improveFluency: "Fluency",
    improveFluencyReason: "Reason",
    reviewGrammar: "Grammar {area}",
    reviewGrammarReason: "Reason",
  },
  exportSnapshot: "Snapshot PDF",
  exportFull: "Full PDF",
  previewTitle: "Preview",
  previewSubtitle: "Preview sub",
  printAction: "Print",
  footerNote: "Footer",
};

function minimalPortfolio(overrides?: Partial<StudentPortfolioViewModel>): StudentPortfolioViewModel {
  return {
    identity: {
      name: "Alex",
      email: "alex@test.com",
      avatarUrl: null,
      joinDate: null,
      profileCompletionPercent: 50,
    },
    hero: {
      levelName: "Starters",
      programName: "YLE",
      programSlug: "starters",
      cefrEstimate: "A1",
      totalXp: 100,
      level: 2,
      levelProgressPercent: 40,
      currentStreak: 5,
      bestStreak: 10,
    },
    snapshot: {
      levelName: "Starters",
      cefrEstimate: "A1",
      unitsCompleted: 2,
      mocksCompleted: 1,
      writingTasksCompleted: 0,
      speakingTasksCompleted: 0,
      certificationsEarned: 0,
      achievementsUnlocked: 1,
      hasProgram: true,
    },
    learning: {
      currentUnitTitle: "Unit 1",
      currentLessonTitle: "Lesson 1",
      unitsCompleted: 2,
      lessonsCompleted: 5,
      progressPercent: 30,
      nextMilestoneTitle: null,
      journeyHref: "/journey",
      hasProgress: true,
    },
    mockPerformance: {
      mocksCompleted: 1,
      bestScorePercent: 80,
      latestScorePercent: 75,
      recommendedMock: null,
      readiness: {
        hasAnalytics: true,
        readinessPercent: 70,
        readinessBand: "developing",
        strongestSkill: "reading",
        weakestSkill: "writing",
        suggestedFocus: "grammar",
        recommendedLevelName: null,
      },
      recentResults: [],
      trendLabel: "stable",
      hasMocks: true,
    },
    writing: {
      tasksCompleted: 0,
      averageScore: null,
      topStrengths: [],
      improvementAreas: [],
      recentItems: [],
      trendLabel: null,
      hasHistory: false,
    },
    speaking: {
      tasksCompleted: 0,
      averageScore: null,
      pronunciationAvg: null,
      fluencyAvg: null,
      vocabularyAvg: null,
      recentItems: [],
      trendLabel: null,
      hasHistory: false,
    },
    certifications: { entries: [], goldMocksCompleted: 0, hasCertifications: false },
    achievements: {
      recentUnlocked: [],
      rareUnlocked: [],
      nextAchievement: null,
      unlockedCount: 1,
      totalCount: 20,
    },
    journey: {
      summary: null,
      milestones: [],
      completedLevelCount: 0,
      totalLevelCount: 5,
      currentMilestoneTitle: null,
      nextMilestoneTitle: null,
      journeyHref: "/journey",
      hasJourney: true,
    },
    futureGoals: [],
    shareReady: {
      studentName: "Alex",
      levelName: "Starters",
      cefrEstimate: "A1",
      lessonsCompleted: 5,
      mocksCompleted: 1,
      achievementsUnlocked: 1,
      certificationsCount: 0,
      generatedAt: new Date().toISOString(),
    },
    ...overrides,
  };
}

const emptySkillInsights: DashboardSkillInsightsView = {
  grammarStrengths: [],
  grammarWeaknesses: [],
  vocabularyStrengths: [],
  vocabularyWeaknesses: [],
  skillStrengths: [],
  skillWeaknesses: [],
  hasAnalytics: false,
  detailHref: "/learning",
};

describe("U8.5 Reporting foundation", () => {
  it("derives learning consistency from streak", () => {
    expect(deriveConsistency(5, 10)).toBe("consistent");
    expect(deriveConsistency(1, 10)).toBe("returning");
    expect(deriveConsistency(0, 0)).toBe("getting-started");
  });

  it("builds parent snapshot with activity", () => {
    const snapshot = buildParentProgressSnapshot(minimalPortfolio(), {
      id: "1",
      kind: "lesson",
      title: "Lesson complete",
      occurredAt: new Date().toISOString(),
    });
    expect(snapshot.studentName).toBe("Alex");
    expect(snapshot.hasData).toBe(true);
    expect(snapshot.latestActivityTitle).toBe("Lesson complete");
  });

  it("builds learning summary with consistency note", () => {
    const summary = buildLearningProgressSummary(
      minimalPortfolio(),
      null,
      minimalLabels
    );
    expect(summary.consistency).toBe("consistent");
    expect(summary.isEmpty).toBe(false);
  });

  it("builds next steps for new student", () => {
    const portfolio = minimalPortfolio({
      learning: {
        ...minimalPortfolio().learning,
        lessonsCompleted: 0,
        hasProgress: false,
        currentLessonTitle: null,
      },
    });
    const steps = buildNextStepsSummary(portfolio, minimalLabels, {
      resolveAchievement: () => ({ title: "A", description: "D" }),
      resolveMilestone: (k) => k,
      resolveCertification: (e) => e.title,
      resolveGoal: (k) => k,
    });
    expect(steps.steps.some((s) => s.id === "start-learning")).toBe(true);
  });

  it("assembles full report view model", () => {
    const report = buildStudentProgressReportViewModel(
      minimalPortfolio(),
      emptySkillInsights,
      null,
      minimalLabels,
      {
        resolveAchievement: () => ({ title: "Badge", description: "Desc" }),
        resolveMilestone: (k) => k,
        resolveCertification: (e) => e.title,
        resolveGoal: (k) => k,
      }
    );
    expect(report.snapshot.studentName).toBe("Alex");
    expect(report.hasAnyProgress).toBe(true);
    expect(report.mockPerformance.bestScorePercent).toBe(80);
  });
});
