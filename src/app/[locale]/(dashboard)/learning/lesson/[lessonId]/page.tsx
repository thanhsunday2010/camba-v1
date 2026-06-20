import { redirect, notFound } from "next/navigation";
import { getCurrentUser } from "@/actions/auth";
import { getLessonWithExercises, getLessonProgress } from "@/lib/queries/learning";
import { isLessonUnlockedFromProgress } from "@/lib/learning/unlock";
import { LessonPlayer } from "@/components/learning/lesson-player";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface LessonPageProps {
  params: Promise<{ lessonId: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [lesson, progress] = await Promise.all([
    getLessonWithExercises(lessonId),
    getLessonProgress(user.id, lessonId),
  ]);

  if (!lesson) notFound();

  const isUnlocked = isLessonUnlockedFromProgress(progress);

  if (!isUnlocked) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-4 py-12">
        <Lock className="h-12 w-12 text-gray-400 mx-auto" />
        <h1 className="text-xl font-bold text-gray-900">Bài học chưa mở khóa</h1>
        <p className="text-gray-500">
          Hoàn thành bài học trước với mức thành thạo ≥ 3 để mở khóa bài này.
        </p>
        <Link href="/learning">
          <Button variant="outline">Quay lại lộ trình</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link href="/learning">
        <Button variant="ghost" size="sm">← Lộ trình học</Button>
      </Link>
      <LessonPlayer
        lessonId={lessonId}
        lessonTitle={lesson.title}
        exercises={lesson.exercises ?? []}
      />
    </div>
  );
}
