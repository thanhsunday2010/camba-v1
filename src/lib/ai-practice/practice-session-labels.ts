export interface PracticeEnhancementLabels {
  improvementTitle: string;
  scoreDelta: string;
  newPersonalBest: string;
  peerCompare: string;
  xpEarned: string;
  focusFixTitle: string;
  bestPhraseTitle: string;
  retrySamePrompt: string;
  retryHint: string;
  shareImprovement: string;
  shareCopied: string;
}

export interface PracticeProgressLabels {
  title: string;
  overall: string;
  personalBest: string;
  thisWeek: string;
  heatmap: string;
  recurringErrors: string;
  weeklySummary: string;
  trendUp: string;
  trendDown: string;
  trendStable: string;
  pronunciation?: string;
  fluency?: string;
  grammar?: string;
  vocabulary?: string;
  coherence?: string;
}

export interface PracticeModelAnswerTtsLabels {
  playing: string;
  replay: string;
  stop: string;
}

export interface PracticeWritingSessionLabels {
  setupPath: string;
  round: string;
  analysis: string;
  prompt: string;
  instructions: string;
  yourWriting: string;
  submit: string;
  submitting: string;
  continue: string;
  continuing: string;
  changeSetup: string;
  minWordsError: string;
  modeMicro: string;
  modeRoleplay: string;
  outlineStep: string;
  outlineHint: string;
  outlinePlaceholder: string;
  outlineRequired: string;
  outlineNext: string;
  sentenceStarters: string;
  feedback: {
    result: string;
    estimatedLevel: string;
    grammar: string;
    vocabulary: string;
    coherence: string;
    improvements: string;
    pronunciation: string;
    fluency: string;
    suggestions: string;
    overallScore: string;
    modelAnswer: string;
    errorHighlights: string;
    correctedVersion: string;
    bestPhrase: string;
    focusFix: string;
  };
  enhancement: PracticeEnhancementLabels;
  progress: PracticeProgressLabels;
  modelAnswerTts: PracticeModelAnswerTtsLabels;
}

export interface PracticeSpeakingSessionLabels {
  setupPath: string;
  round: string;
  analysis: string;
  prompt: string;
  instructions: string;
  followUp: string;
  submit: string;
  submitting: string;
  continue: string;
  continuing: string;
  changeSetup: string;
  startRecording: string;
  stopRecording: string;
  noRecording: string;
  recording: string;
  transcript: string;
  transcriptPlaceholder: string;
  transcriptUnsupported: string;
  micAccessDenied: string;
  micNotFound: string;
  micInsecureContext: string;
  micNotSupported: string;
  micRecorderUnsupported: string;
  micUnknownError: string;
  questionAudioPlaying: string;
  replayQuestion: string;
  stopAudio: string;
  modeMicro: string;
  modeRoleplay: string;
  sentenceStarters: string;
  phases: {
    listen: string;
    repeat: string;
    answer: string;
    nextPhase: string;
    repeatPrompt: string;
  };
  feedback: {
    result: string;
    estimatedLevel: string;
    grammar: string;
    vocabulary: string;
    coherence: string;
    improvements: string;
    pronunciation: string;
    fluency: string;
    suggestions: string;
    overallScore: string;
    transcript?: string;
    modelAnswer: string;
    errorHighlights?: string;
    correctedVersion?: string;
    bestPhrase: string;
    focusFix: string;
  };
  enhancement: PracticeEnhancementLabels;
  progress: PracticeProgressLabels;
  modelAnswerTts: PracticeModelAnswerTtsLabels;
}
