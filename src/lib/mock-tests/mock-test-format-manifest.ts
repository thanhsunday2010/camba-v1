import type { MockTestFormatMetadata } from "@/lib/mock-tests/mock-test-format";
import type { YleMockManifest } from "@/lib/mock-blueprints/yle-mock-manifest-types";
import { deriveMockTestFormatMetadata } from "@/lib/mock-tests/mock-test-format";

export function deriveFormatFromManifest(manifest: YleMockManifest): MockTestFormatMetadata {
  const sections = manifest.sections.map((section) => ({
    id: section.sectionSlug,
    title: section.title,
    sortOrder: section.sortOrder,
    questionCount: section.questionRefs?.length ?? 0,
    timeLimitMinutes: section.timeLimitMinutes ?? null,
    skillSlug: section.skillSlug ?? null,
    skillName: null,
  }));

  const listeningParts = (manifest.parts ?? []).filter((p) => p.sectionSlug === "listening");
  const questionContexts = listeningParts.map((p) => ({
    sectionSkillSlug: "listening",
    contextType: p.contextType ?? "listening",
    audioSrc: p.audio?.src ?? null,
  }));

  return deriveMockTestFormatMetadata({
    levelId: manifest.metadata.levelId ?? null,
    levelSlug: manifest.metadata.levelSlug,
    sections,
    questionContexts,
  });
}
