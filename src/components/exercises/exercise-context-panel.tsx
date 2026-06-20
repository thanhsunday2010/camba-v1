import { ListeningAudioPlayer } from "@/components/exercises/listening-audio-player";

type ReadingPassageContent = {
  title?: string;
  text?: string;
  wordCount?: number;
  imagePrompt?: string;
};

type ListeningScriptLine = {
  speaker?: string;
  text?: string;
};

type ListeningScriptContent = {
  title?: string;
  setting?: string;
  speakers?: Array<{ name?: string; role?: string }>;
  lines?: ListeningScriptLine[];
  audioNotes?: string;
};

interface ExerciseContextPanelProps {
  exerciseType?: string;
  content?: Record<string, unknown>;
  showListeningTranscript?: boolean;
  autoPlayListening?: boolean;
  labels?: {
    passage: string;
    listening: string;
    wordCount: string;
    transcriptAfter: string;
  };
}

export function ExerciseContextPanel({
  exerciseType,
  content,
  showListeningTranscript = false,
  autoPlayListening = true,
  labels = {
    passage: "Đoạn văn",
    listening: "Bài nghe",
    wordCount: "từ",
    transcriptAfter: "Bản ghi (sau khi nộp bài)",
  },
}: ExerciseContextPanelProps) {
  if (!content) return null;

  const passage = content.passage as ReadingPassageContent | undefined;
  if (passage?.text) {
    return (
      <div className="rounded-lg border border-primary/15 bg-primary/5 p-4 mb-6">
        <p className="text-xs font-medium uppercase tracking-wide text-primary mb-2">
          {labels.passage}
        </p>
        {passage.title && (
          <h3 className="text-base font-semibold text-gray-900 mb-2">{passage.title}</h3>
        )}
        <div className="text-sm text-gray-800 whitespace-pre-line leading-relaxed">
          {passage.text}
        </div>
        {typeof passage.wordCount === "number" && passage.wordCount > 0 && (
          <p className="text-xs text-gray-400 mt-3">
            {passage.wordCount} {labels.wordCount}
          </p>
        )}
      </div>
    );
  }

  const script = content.script as ListeningScriptContent | undefined;
  const audioUrl = typeof content.audioUrl === "string" ? content.audioUrl : null;
  const isListening =
    exerciseType === "listening" || Boolean(script?.lines?.length && audioUrl);

  if (isListening && audioUrl) {
    return (
      <div className="space-y-4 mb-6">
        <ListeningAudioPlayer
          audioUrl={audioUrl}
          title={script?.title}
          autoPlay={autoPlayListening}
        />
        {showListeningTranscript && script?.lines?.length ? (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs font-medium text-gray-500 mb-2">{labels.transcriptAfter}</p>
            {script.setting && (
              <p className="text-xs text-gray-400 mb-2">{script.setting}</p>
            )}
            <div className="space-y-2">
              {script.lines.map((line, index) => (
                <p key={index} className="text-sm text-gray-700 leading-relaxed">
                  {line.speaker && (
                    <span className="font-medium text-gray-900">{line.speaker}: </span>
                  )}
                  {line.text}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-500">
            Nghe audio và chọn đáp án. Bạn có thể bấm &quot;Nghe lại&quot; bất cứ lúc nào.
          </p>
        )}
      </div>
    );
  }

  if (script?.lines?.length && exerciseType === "listening") {
    return (
      <div className="rounded-lg border border-warning/30 bg-warning/5 p-4 mb-6">
        <p className="text-sm text-gray-700">
          Audio chưa sẵn sàng cho bài nghe này. Vui lòng báo giáo viên hoặc thử lại sau.
        </p>
      </div>
    );
  }

  return null;
}
