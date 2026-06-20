"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/actions/auth";
import { isAdmin } from "@/lib/auth/roles";
import { generateJsonResponse } from "@/lib/ai/gemini-client";
import { parseGeminiJson } from "@/lib/ai/parse-feedback";
import {
  QUESTION_GENERATOR_SYSTEM,
  buildQuestionGeneratorPrompt,
} from "@/lib/ai/prompts/question-generator";
import { QuestionGeneratorSchema } from "@/types/ai";
import type { QuestionGeneratorResponse } from "@/types/ai";
import type { ActionResult } from "@/types";
import { saveAiFeedback } from "./_shared";
import type { Json } from "@/types/database";

export async function generateQuestionsWithAi(
  formData: FormData
): Promise<ActionResult<QuestionGeneratorResponse & { exerciseId?: string }>> {
  const user = await getCurrentUser();
  if (!user || !isAdmin(user.roles)) {
    return { success: false, error: "Unauthorized" };
  }

  const lessonId = formData.get("lessonId") as string;
  const skill = formData.get("skill") as string;
  const level = formData.get("level") as string;
  const questionType = formData.get("questionType") as string;
  const count = parseInt(formData.get("count") as string, 10) || 3;
  const topic = formData.get("topic") as string;
  const autoCreate = formData.get("autoCreate") === "true";

  try {
    const rawJson = await generateJsonResponse(
      QUESTION_GENERATOR_SYSTEM,
      buildQuestionGeneratorPrompt({ skill, level, questionType, count, topic })
    );

    const generated = parseGeminiJson(rawJson, QuestionGeneratorSchema);

    await saveAiFeedback({
      feedbackType: "question_generator",
      referenceType: "admin_generation",
      referenceId: user.id,
      inputData: { skill, level, questionType, count, topic },
      responseData: generated as unknown as Record<string, unknown>,
    });

    let exerciseId: string | undefined;

    if (autoCreate && lessonId) {
      const supabase = await createClient();
      const slug = `ai-${Date.now()}`;

      const { data: exercise } = await supabase
        .from("exercises")
        .insert({
          lesson_id: lessonId,
          slug,
          title: `AI: ${generated.topic}`,
          instructions: `AI-generated ${generated.difficulty} ${skill} questions — pending review`,
          exercise_type: questionType as "multiple_choice",
          status: "pending_review",
          is_active: false,
          created_by: user.id,
          metadata: { ai_generated: true, topic: generated.topic } as Json,
        })
        .select("id")
        .single();

      if (exercise) {
        exerciseId = exercise.id;
        for (let i = 0; i < generated.questions.length; i++) {
          const q = generated.questions[i];
          const { data: question } = await supabase
            .from("questions")
            .insert({
              exercise_id: exercise.id,
              question_text: q.questionText,
              question_type: (q.questionType as "multiple_choice") ?? "multiple_choice",
              explanation: q.explanation ?? null,
              sort_order: i,
              content: (q.content ?? {}) as Json,
            })
            .select("id")
            .single();

          if (question && q.choices) {
            await supabase.from("choices").insert(
              q.choices.map((c, j) => ({
                question_id: question.id,
                text: c.text,
                is_correct: c.isCorrect,
                sort_order: j,
              }))
            );
          }
        }
      }
    }

    revalidatePath("/admin");

    return { success: true, data: { ...generated, exerciseId } };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Generation failed";
    return { success: false, error: message };
  }
}
