/** Normalize Gold Mock image paths to generated SVG assets. */

export function normalizeGoldMockImageSrc(src) {
  if (!src || typeof src !== "string") return src;
  if (src.startsWith("/images/gold-mocks/") && src.endsWith(".png")) {
    return src.replace(/\.png$/, ".svg");
  }
  return src;
}

export function goldMockImageOutputPath(src) {
  const normalized = normalizeGoldMockImageSrc(src);
  return normalized.startsWith("/") ? normalized.slice(1) : normalized;
}

export function normalizeQuestionImageFields(question) {
  if (!question) return question;

  const content = question.content ? { ...question.content } : undefined;
  if (content) {
    if (typeof content.imageUrl === "string") {
      content.imageUrl = normalizeGoldMockImageSrc(content.imageUrl);
    }
    if (Array.isArray(content.pictureSequence)) {
      content.pictureSequence = content.pictureSequence.map(normalizeGoldMockImageSrc);
    }
  }

  const next = content ? { ...question, content } : { ...question };
  for (const key of [
    "cambridgeTaskType",
    "prompt",
    "taskDescription",
    "minWords",
    "maxWords",
    "imageUrl",
    "requiredPoints",
    "maxDurationSeconds",
    "followUpQuestions",
    "pictureSequence",
    "template",
    "correctAnswers",
    "passage",
  ]) {
    if (key in next) delete next[key];
  }
  return next;
}

export function normalizeManifestQuestionImages(questions) {
  return (questions ?? []).map(normalizeQuestionImageFields);
}

export function collectImageAssetsFromManifest(raw) {
  /** @type {Map<string, { prompt?: string, questionText?: string, variant: string, panelIndex?: number, panelTotal?: number }>} */
  const assets = new Map();

  for (const q of raw.questions ?? []) {
    const content = q.content ?? {};
    const meta = {
      prompt: typeof content.prompt === "string" ? content.prompt : q.questionText,
      questionText: q.questionText,
    };

    if (typeof content.imageUrl === "string" && content.imageUrl.trim()) {
      assets.set(content.imageUrl, {
        ...meta,
        variant: inferVariant(content.imageUrl, content),
      });
    }

    if (Array.isArray(content.pictureSequence)) {
      const total = content.pictureSequence.length;
      content.pictureSequence.forEach((url, index) => {
        if (typeof url !== "string" || !url.trim()) return;
        assets.set(url, {
          ...meta,
          variant: "story",
          panelIndex: index + 1,
          panelTotal: total,
        });
      });
    }
  }

  return assets;
}

function inferVariant(url, content) {
  const lower = url.toLowerCase();
  if (lower.includes("-pair")) return "pair";
  if (lower.includes("speaking-photo")) return "photo";
  if (lower.includes("-story") && lower.endsWith(".svg")) return "comic";
  if (lower.includes("story-")) return "story";
  if (Array.isArray(content.pictureSequence) && content.pictureSequence.length > 0) {
    return "story";
  }
  return "scene";
}
