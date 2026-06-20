import { getTranslations } from "next-intl/server";
import { getCurrentUser } from "@/actions/auth";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { PlacementTestCTA } from "@/components/dashboard/placement-test-cta";
import { DailyMissions } from "@/components/gamification/daily-missions";
import { StreakCalendar } from "@/components/gamification/streak-calendar";
import { BadgeGrid } from "@/components/gamification/badge-grid";
import { LeagueBoard } from "@/components/gamification/league-board";
import { XpProgressBar } from "@/components/gamification/xp-progress-bar";
import { getUserGamification, getUserStreak } from "@/lib/queries/user";
import { getNextUnlockedLessonFast } from "@/lib/queries/learning";
import { getGamificationDashboardData } from "@/lib/queries/gamification";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { StudyCoachCard } from "@/components/ai/study-coach-card";
import { RecommendationList } from "@/components/ai/recommendation-list";
import { getLatestStudyCoach } from "@/actions/ai/study-coach";
import { fetchActiveRecommendations } from "@/actions/ai/recommendations";
import { fetchActiveProgramContext, fetchAvailablePrograms } from "@/actions/programs";
import { ProgramPicker } from "@/components/programs/program-picker";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const t = await getTranslations("dashboard");
  const tg = await getTranslations("gamification");
  const ta = await getTranslations("ai");
  const tp = await getTranslations("programs");

  const [gamification, streakData, gamificationData, coachPlan, recommendations, programs] =
    await Promise.all([
      getUserGamification(user.id),
      getUserStreak(user.id),
      getGamificationDashboardData(user.id),
      getLatestStudyCoach(user.id),
      fetchActiveRecommendations(user.id),
      fetchAvailablePrograms(),
    ]);

  const [programContext, nextLesson] = await Promise.all([
    fetchActiveProgramContext(gamification),
    gamification?.current_level_id
      ? getNextUnlockedLessonFast(user.id, gamification.current_level_id)
      : Promise.resolve(null),
  ]);

  const programName = programContext?.program.name;
  const levelName = programContext?.level?.name;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t("welcome", { name: user.fullName || user.email })}
        </h1>
        {programName && (
          <p className="text-sm text-primary font-medium mt-1">
            {t("currentProgram")}: {programName}
            {levelName ? ` • ${levelName}` : ""}
          </p>
        )}
      </div>

      {!programContext?.programId && (
        <ProgramPicker
          programs={programs}
          labels={{
            title: tp("selectTitle"),
            subtitle: tp("selectSubtitle"),
            select: tp("select"),
            selecting: tp("selecting"),
            current: tp("current"),
          }}
        />
      )}

      {programContext?.programId && (
        <StatsCards
          gamification={gamification}
          streak={streakData?.current_streak ?? 0}
          levelName={levelName}
          labels={{
            xp: t("xp"),
            level: t("level"),
            streak: t("streak"),
            coins: tg("coins"),
            currentLevel: t("currentLevel"),
            days: t("days"),
            notStarted: t("notStarted"),
          }}
        />
      )}

      {gamification && programContext?.programId && (
        <XpProgressBar
          totalXp={gamification.total_xp}
          level={gamification.level}
          coins={gamification.coins}
          xpLabel={t("xp")}
          coinsLabel={tg("coins")}
          levelProgressLabel={tg("levelProgress")}
        />
      )}

      {programContext?.programId && !gamification?.current_level_id && (
        <PlacementTestCTA
          title={t("startPlacementTest")}
          description={t("startPlacementTestDesc")}
          buttonText={t("startPlacementTest")}
        />
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <StudyCoachCard
          initialPlan={coachPlan}
          labels={{
            title: ta("coachTitle"),
            subtitle: ta("coachSubtitle"),
            generate: ta("generatePlan"),
            generating: ta("generating"),
            dailyRecommendations: ta("dailyRecommendations"),
            motivation: ta("motivation"),
            strengths: ta("strengths"),
            weaknesses: ta("weaknesses"),
            weeklyPlan: ta("weeklyPlan"),
          }}
        />
        <RecommendationList
          recommendations={recommendations}
          title={ta("recommendationsTitle")}
          emptyText={ta("noRecommendations")}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <DailyMissions
          missions={gamificationData.missions}
          title={t("dailyMissions")}
          emptyText={t("notStarted")}
        />
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900 mb-4">{t("recommendedLessons")}</h2>
          {nextLesson ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{nextLesson.title}</p>
                <p className="text-sm text-gray-500">{nextLesson.estimated_minutes} phút</p>
              </div>
              <Link href={`/learning/lesson/${nextLesson.id}`}>
                <Button size="sm">
                  {t("continueLearning")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <p className="text-sm text-gray-500">{t("notStarted")}</p>
          )}
        </section>
      </div>

      <StreakCalendar
        days={gamificationData.streakCalendar}
        currentStreak={streakData?.current_streak ?? 0}
        bestStreak={streakData?.best_streak ?? 0}
        title={tg("streakCalendar")}
        currentLabel={tg("currentStreak")}
        bestLabel={tg("bestStreak")}
        daysLabel={t("days")}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <LeagueBoard
          rankings={gamificationData.league.rankings}
          userRank={gamificationData.league.userRank}
          tier={gamificationData.league.tier}
          title={t("weeklyLeague")}
          yourRankLabel={tg("yourRank")}
          xpLabel={t("xp")}
          emptyText={tg("noLeagueData")}
        />
        <BadgeGrid
          badges={gamificationData.badges}
          title={tg("badges")}
          emptyText={tg("noBadges")}
        />
      </div>
    </div>
  );
}
