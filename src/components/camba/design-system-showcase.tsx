"use client";

import { useState } from "react";
import {
  AppTabs,
  BadgeCard,
  CambridgeProgramTheme,
  CambridgeShieldCard,
  CelebrationBanner,
  CoinChip,
  ContinueLearningCard,
  EmptyIllustratedState,
  FeedbackBanner,
  FilterChip,
  HeroCard,
  LessonCard,
  LevelBadge,
  MissionCard,
  MissionCompletedBanner,
  MockTestCard,
  MasteryMeter,
  PageHeader,
  ProgressCard,
  ProgressRing,
  ProgressSegmentBar,
  RewardSummaryCard,
  SectionHeader,
  SkillCard,
  SkillShieldProgress,
  StatCard,
  StreakCard,
  StudentDashboardLayout,
  StudentPageShell,
  UnitCard,
  XPBar,
  DashboardSkeleton,
  SkeletonList,
} from "@/components/camba";
import { Button } from "@/components/ui/button";
import { BookOpen, Sparkles, Target, Trophy } from "lucide-react";
import { useCelebration } from "@/components/camba/celebration/celebration-provider";

const TABS = [
  { id: "layout", label: "Bố cục" },
  { id: "cards", label: "Thẻ" },
  { id: "gamification", label: "Gamification" },
  { id: "cambridge", label: "Cambridge" },
  { id: "feedback", label: "Phản hồi" },
];

export function DesignSystemShowcase() {
  const [tab, setTab] = useState("layout");
  const { celebrateXp, celebrateLevelUp, celebrateBadge } = useCelebration();

  return (
    <CambridgeProgramTheme programSlug="starters">
      <StudentPageShell>
        <PageHeader
          title="CAMBA Design System"
          subtitle="Xem trước thành phần giao diện — Phase U2"
          icon={Sparkles}
        />

        <AppTabs tabs={TABS} activeId={tab} onChange={setTab} />

        {tab === "layout" && (
          <StudentDashboardLayout
            sidebar={
              <StreakCard
                currentStreak={5}
                bestStreak={12}
                encouragement="Hôm nay con đang có chuỗi 5 ngày học liên tiếp!"
              />
            }
          >
            <HeroCard
              studentName="Minh Anh"
              greeting="Xin chào"
              programName="Cambridge English"
              levelName="Starters"
              programSlug="starters"
              streak={5}
              streakLabel="ngày"
              level={7}
            />
            <ContinueLearningCard
              lessonTitle="Bài 2: Đếm đến hai mươi"
              lessonHref="/learning"
              estimatedMinutes={16}
            />
          </StudentDashboardLayout>
        )}

        {tab === "cards" && (
          <div className="space-y-6">
            <SectionHeader title="Thẻ học tập" icon={BookOpen} />
            <div className="grid sm:grid-cols-2 gap-4">
              <StatCard label="Điểm XP" value="1.250" icon={Sparkles} />
              <StatCard label="Huy hiệu" value="8" icon={Trophy} trend="+2 tuần này" />
            </div>
            <ProgressCard
              title="Tiến độ Unit 3"
              description="Màu sắc và quần áo"
              value={60}
              valueLabel="60%"
            />
            <UnitCard
              title="Unit 3: Colours and Clothes"
              subtitle="12 bài · 60 bài tập"
              progress={45}
              progressLabel="Hoàn thành 45%"
              lessonCount={12}
              expanded
            >
              <LessonCard
                title="Bài 1: Từ vựng màu sắc"
                subtitle="5 bài tập · 14 phút"
                state="in-progress"
                stateLabel="Đang học"
                masteryLevel={2}
                masteryLabel="Đang phát triển"
                href="/learning"
              />
              <LessonCard
                title="Bài 2: Ngữ pháp"
                subtitle="5 bài tập"
                state="locked"
                stateLabel="Đã khóa"
              />
            </UnitCard>
            <SkillCard skillLabel="Nghe" progress={72} masteryLabel="Khá" icon={Target} />
            <MockTestCard
              title="Starters Mock Test 1"
              description="30 câu · 6 kỹ năng"
              bestScore={85}
              attemptCount={2}
              href="/mock-tests"
            />
          </div>
        )}

        {tab === "gamification" && (
          <div className="space-y-6">
            <XPBar
              totalXp={1250}
              level={7}
              coins={340}
              xpLabel="XP"
              coinsLabel="Xu"
              levelLabel="Cấp"
            />
            <div className="flex flex-wrap gap-2">
              <LevelBadge level={7} />
              <CoinChip amount={340} label="Xu" />
              <FilterChip label="Tất cả" active />
              <FilterChip label="Đã hoàn thành" />
            </div>
            <MissionCard
              title="Hoàn thành 3 bài học"
              description="Nhiệm vụ hôm nay"
              progress={66}
              progressLabel="2/3 bài"
            />
            <RewardSummaryCard title="Phần thưởng vừa nhận" xp={25} coins={10} badges={["Chuỗi 5 ngày"]} />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <BadgeCard name="Chuỗi 7 ngày" description="Học liên tiếp 7 ngày" earned />
              <BadgeCard name="Vua nghe" earned={false} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => celebrateXp(25)}>
                Toast XP
              </Button>
              <Button variant="outline" onClick={() => celebrateLevelUp(8)}>
                Level up
              </Button>
              <Button variant="outline" onClick={() => celebrateBadge("Chuỗi 7 ngày")}>
                Huy hiệu
              </Button>
            </div>
          </div>
        )}

        {tab === "cambridge" && (
          <div className="space-y-6">
            <ProgressRing value={68} label="68%" sublabel="Shield" />
            <CambridgeShieldCard
              programSlug="starters"
              programLabel="Pre-A1"
              filledSegments={3}
              description="Con đang tiến bộ tốt trên hành trình Starters!"
            />
            <SkillShieldProgress skillLabel="Đọc" filledSegments={4} />
            <ProgressSegmentBar segments={5} filled={3} />
            <MasteryMeter level={3} label="Mức thành thạo" />
          </div>
        )}

        {tab === "feedback" && (
          <div className="space-y-4">
            <CelebrationBanner
              title="Tuyệt vời!"
              description="Con vừa hoàn thành bài học với 90% chính xác."
            />
            <MissionCompletedBanner
              title="Hoàn thành nhiệm vụ hôm nay"
              description="Nhận thêm XP và xu thưởng."
            />
            <FeedbackBanner tone="success" title="Trả lời đúng!" description="Giải thích chi tiết ở bên dưới." />
            <FeedbackBanner tone="warning" title="Gần đúng rồi" description="Hãy thử lại câu này nhé." />
            <EmptyIllustratedState
              icon={BookOpen}
              title="Chưa có bài học"
              description="Chọn chương trình và cấp độ để bắt đầu hành trình Cambridge."
              actionLabel="Bắt đầu học"
              actionHref="/learning"
            />
            <SectionHeader title="Skeleton loading" />
            <SkeletonList count={2} />
            <details className="camba-caption text-muted">
              <summary>Dashboard skeleton</summary>
              <DashboardSkeleton />
            </details>
          </div>
        )}
      </StudentPageShell>
    </CambridgeProgramTheme>
  );
}
