import type { PracticeSetupLabels } from "@/components/ai-practice/practice-setup-form";
import type { PracticeHistoryLabels } from "@/components/ai-practice/practice-history-panel";
import type {
  PracticeSpeakingSessionLabels,
  PracticeWritingSessionLabels,
} from "@/lib/ai-practice/practice-session-labels";

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
    bestPhrase: t("feedback.bestPhrase"),
    focusFix: t("feedback.focusFix"),
  };
}

function enhancementLabels(t: Translator) {
  return {
    improvementTitle: t("enhancement.improvementTitle"),
    scoreDelta: t("enhancement.scoreDelta"),
    newPersonalBest: t("enhancement.newPersonalBest"),
    peerCompare: t("enhancement.peerCompare"),
    xpEarned: t("enhancement.xpEarned"),
    focusFixTitle: t("enhancement.focusFixTitle"),
    bestPhraseTitle: t("enhancement.bestPhraseTitle"),
    retrySamePrompt: t("enhancement.retrySamePrompt"),
    retryHint: t("enhancement.retryHint"),
    shareImprovement: t("enhancement.shareImprovement"),
    shareCopied: t("enhancement.shareCopied"),
  };
}

function progressLabels(t: Translator) {
  return {
    title: t("progress.title"),
    overall: t("progress.overall"),
    personalBest: t("progress.personalBest"),
    thisWeek: t("progress.thisWeek"),
    heatmap: t("progress.heatmap"),
    recurringErrors: t("progress.recurringErrors"),
    weeklySummary: t("progress.weeklySummary"),
    trendUp: t("progress.trendUp"),
    trendDown: t("progress.trendDown"),
    trendStable: t("progress.trendStable"),
    pronunciation: t("feedback.pronunciation"),
    fluency: t("feedback.fluency"),
    grammar: t("feedback.grammar"),
    vocabulary: t("feedback.vocabulary"),
    coherence: t("feedback.coherence"),
  };
}

function modelAnswerTtsLabels(t: Translator) {
  return {
    playing: t("modelAnswerTts.playing"),
    replay: t("modelAnswerTts.replay"),
    stop: t("modelAnswerTts.stop"),
  };
}

function sharedSetupFields(t: Translator) {
  return {
    language: t("fields.language"),
    level: t("fields.level"),
    program: t("fields.program"),
    mode: t("fields.mode"),
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
    modes: {
      standard: t("modes.standard"),
      micro: t("modes.micro"),
      roleplay: t("modes.roleplay"),
    },
  };
}

export function buildWritingSetupLabels(t: Translator): PracticeSetupLabels {
  return {
    title: t("writing.setupTitle"),
    subtitle: t("writing.setupSubtitle"),
    ...sharedSetupFields(t),
  };
}

export function buildSpeakingSetupLabels(t: Translator): PracticeSetupLabels {
  return {
    title: t("speaking.setupTitle"),
    subtitle: t("speaking.setupSubtitle"),
    ...sharedSetupFields(t),
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
    modeMicro: t("modes.micro"),
    modeRoleplay: t("modes.roleplay"),
    outlineStep: t("writing.outlineStep"),
    outlineHint: t("writing.outlineHint"),
    outlinePlaceholder: t("writing.outlinePlaceholder"),
    outlineRequired: t("writing.outlineRequired"),
    outlineNext: t("writing.outlineNext"),
    sentenceStarters: t("session.sentenceStarters"),
    feedback: sharedFeedbackLabels(t),
    enhancement: enhancementLabels(t),
    progress: progressLabels(t),
    modelAnswerTts: modelAnswerTtsLabels(t),
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
    stopAudio: t("modelAnswerTts.stop"),
    modeMicro: t("modes.micro"),
    modeRoleplay: t("modes.roleplay"),
    sentenceStarters: t("session.sentenceStarters"),
    phases: {
      listen: t("phases.listen"),
      repeat: t("phases.repeat"),
      answer: t("phases.answer"),
      nextPhase: t("phases.nextPhase"),
      repeatPrompt: t("phases.repeatPrompt"),
    },
    feedback: {
      ...sharedFeedbackLabels(t),
      transcript: t("speaking.transcript"),
    },
    enhancement: enhancementLabels(t),
    progress: progressLabels(t),
    modelAnswerTts: modelAnswerTtsLabels(t),
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

export type { PracticeWritingSessionLabels, PracticeSpeakingSessionLabels };
