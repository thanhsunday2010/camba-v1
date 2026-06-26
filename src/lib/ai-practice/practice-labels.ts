import type { PracticeSetupLabels } from "@/components/ai-practice/practice-setup-form";
import type { PracticeHistoryLabels } from "@/components/ai-practice/practice-history-panel";
import type { PracticeSpeakingSessionLabels } from "@/components/ai-practice/practice-speaking-session";
import type { PracticeWritingSessionLabels } from "@/components/ai-practice/practice-writing-session";

type Translator = (key: string, values?: Record<string, string | number>) => string;

function sharedFeedbackLabels(t: Translator) {
  return {
    result: t("feedback.result"),
    estimatedLevel: t("feedback.estimatedLevel"),
    grammar: t("feedback.grammar"),
    vocabulary: t("feedback.vocabulary"),
    coherence: t("feedback.coherence"),
    improvements: t("feedback.improvements"),
    pronunciation: t("feedback.pronunciation"),
    fluency: t("feedback.fluency"),
    suggestions: t("feedback.suggestions"),
    overallScore: t("feedback.overallScore"),
    modelAnswer: t("feedback.modelAnswer"),
    errorHighlights: t("feedback.errorHighlights"),
    correctedVersion: t("feedback.correctedVersion"),
  };
}

export function buildWritingSetupLabels(t: Translator): PracticeSetupLabels {
  return {
    title: t("writing.setupTitle"),
    subtitle: t("writing.setupSubtitle"),
    language: t("fields.language"),
    level: t("fields.level"),
    program: t("fields.program"),
    start: t("start"),
    starting: t("starting"),
    levelRequired: t("levelRequired"),
    languages: {
      english: t("languages.english"),
      chinese: t("languages.chinese"),
      french: t("languages.french"),
      japanese: t("languages.japanese"),
      korean: t("languages.korean"),
      german: t("languages.german"),
    },
    programs: {
      general: t("programs.general"),
      ielts: t("programs.ielts"),
      toeic: t("programs.toeic"),
    },
  };
}

export function buildSpeakingSetupLabels(t: Translator): PracticeSetupLabels {
  return {
    title: t("speaking.setupTitle"),
    subtitle: t("speaking.setupSubtitle"),
    language: t("fields.language"),
    level: t("fields.level"),
    program: t("fields.program"),
    start: t("start"),
    starting: t("starting"),
    levelRequired: t("levelRequired"),
    languages: {
      english: t("languages.english"),
      chinese: t("languages.chinese"),
      french: t("languages.french"),
      japanese: t("languages.japanese"),
      korean: t("languages.korean"),
      german: t("languages.german"),
    },
    programs: {
      general: t("programs.general"),
      ielts: t("programs.ielts"),
      toeic: t("programs.toeic"),
    },
  };
}

export function buildWritingSessionLabels(t: Translator): PracticeWritingSessionLabels {
  return {
    setupPath: "/practice/writing",
    round: t("session.round"),
    analysis: t("session.analysis"),
    prompt: t("session.prompt"),
    instructions: t("session.instructions"),
    yourWriting: t("writing.yourWriting"),
    submit: t("session.submit"),
    submitting: t("session.submitting"),
    continue: t("session.continue"),
    continuing: t("session.continuing"),
    changeSetup: t("session.changeSetup"),
    minWordsError: t("writing.minWordsError"),
    feedback: sharedFeedbackLabels(t),
  };
}

export function buildSpeakingSessionLabels(t: Translator): PracticeSpeakingSessionLabels {
  return {
    setupPath: "/practice/speaking",
    round: t("session.round"),
    analysis: t("session.analysis"),
    prompt: t("session.prompt"),
    instructions: t("session.instructions"),
    followUp: t("speaking.followUp"),
    submit: t("session.submit"),
    submitting: t("session.submitting"),
    continue: t("session.continue"),
    continuing: t("session.continuing"),
    changeSetup: t("session.changeSetup"),
    startRecording: t("speaking.startRecording"),
    stopRecording: t("speaking.stopRecording"),
    noRecording: t("speaking.noRecording"),
    recording: t("speaking.recording"),
    transcript: t("speaking.transcript"),
    transcriptPlaceholder: t("speaking.transcriptPlaceholder"),
    transcriptUnsupported: t("speaking.transcriptUnsupported"),
    micAccessDenied: t("speaking.micAccessDenied"),
    micNotFound: t("speaking.micNotFound"),
    micInsecureContext: t("speaking.micInsecureContext"),
    micNotSupported: t("speaking.micNotSupported"),
    micRecorderUnsupported: t("speaking.micRecorderUnsupported"),
    micUnknownError: t("speaking.micUnknownError"),
    questionAudioPlaying: t("speaking.questionAudioPlaying"),
    replayQuestion: t("speaking.replayQuestion"),
    feedback: {
      ...sharedFeedbackLabels(t),
      transcript: t("speaking.transcript"),
    },
  };
}

export function buildPracticeHistoryLabels(t: Translator): PracticeHistoryLabels {
  return {
    title: t("history.title"),
    subtitle: t("history.subtitle"),
    statTotal: t("history.statTotal"),
    statAverage: t("history.statAverage"),
    statBest: t("history.statBest"),
    statThisWeek: t("history.statThisWeek"),
    totalSessionsCompact: t("history.totalSessionsCompact"),
    averageScoreCompact: t("history.averageScoreCompact"),
    recentTitle: t("history.recentTitle"),
    emptyTitle: t("history.emptyTitle"),
    emptyDescription: t("history.emptyDescription"),
    score: t("history.score"),
    estimatedLevel: t("history.estimatedLevel"),
    words: t("history.words"),
    duration: t("history.duration"),
    noScore: t("history.noScore"),
    programs: {
      general: t("programs.general"),
      ielts: t("programs.ielts"),
      toeic: t("programs.toeic"),
    },
  };
}

export function buildDashboardAiPracticeLabels(t: Translator) {
  return {
    title: t("dashboard.title"),
    subtitle: t("dashboard.subtitle"),
    writingTitle: t("dashboard.writingTitle"),
    writingDesc: t("dashboard.writingDesc"),
    speakingTitle: t("dashboard.speakingTitle"),
    speakingDesc: t("dashboard.speakingDesc"),
    start: t("dashboard.start"),
    aiBadge: t("dashboard.aiBadge"),
  };
}
