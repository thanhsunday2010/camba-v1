"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Pause, Play, RotateCcw, Volume2 } from "lucide-react";

interface ListeningAudioPlayerProps {
  audioUrl: string;
  title?: string;
  autoPlay?: boolean;
  labels?: {
    play: string;
    pause: string;
    replay: string;
    loading: string;
    error: string;
  };
}

function resolveAudioSrc(audioUrl: string): string {
  if (audioUrl.startsWith("http://") || audioUrl.startsWith("https://")) {
    return audioUrl;
  }
  // Same-origin static files: relative path works on any deploy URL (Vercel preview, prod, local).
  return audioUrl.startsWith("/") ? audioUrl : `/${audioUrl}`;
}

export function ListeningAudioPlayer({
  audioUrl,
  title,
  autoPlay = true,
  labels = {
    play: "Phát",
    pause: "Tạm dừng",
    replay: "Nghe lại",
    loading: "Đang tải audio...",
    error: "Không phát được audio",
  },
}: ListeningAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const src = resolveAudioSrc(audioUrl);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setIsLoading(true);
    setHasError(false);
    setIsPlaying(false);

    const markReady = () => setIsLoading(false);
    const onError = () => {
      setIsLoading(false);
      setHasError(true);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener("loadeddata", markReady);
    audio.addEventListener("canplay", markReady);
    audio.addEventListener("error", onError);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    if (audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      markReady();
    } else {
      audio.load();
    }

    const timeout = window.setTimeout(() => {
      if (audio.readyState >= HTMLMediaElement.HAVE_METADATA) {
        markReady();
      }
    }, 8000);

    return () => {
      window.clearTimeout(timeout);
      audio.removeEventListener("loadeddata", markReady);
      audio.removeEventListener("canplay", markReady);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
    };
  }, [src]);

  useEffect(() => {
    if (!autoPlay || isLoading || hasError) return;
    const audio = audioRef.current;
    if (!audio) return;

    void audio.play().catch(() => {
      // Autoplay may be blocked; user can press Play.
    });
  }, [autoPlay, isLoading, hasError, src]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    if (isPlaying) {
      audio.pause();
    } else {
      void audio.play().catch(() => setHasError(true));
    }
  }

  function replay() {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    audio.currentTime = 0;
    void audio.play().catch(() => setHasError(true));
  }

  return (
    <div className="rounded-lg border border-accent/25 bg-accent/5 p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
          <Volume2 className="h-5 w-5 text-accent" />
        </div>
        <div className="flex-1 min-w-0 space-y-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-accent">
              Bài nghe
            </p>
            {title && (
              <p className="text-sm font-semibold text-gray-900 mt-0.5">{title}</p>
            )}
          </div>

          <audio ref={audioRef} src={src} preload="auto" playsInline className="hidden" />

          {isLoading ? (
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {labels.loading}
            </p>
          ) : hasError ? (
            <p className="text-sm text-error">{labels.error}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button type="button" size="sm" variant="default" onClick={togglePlay}>
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4" />
                    {labels.pause}
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    {labels.play}
                  </>
                )}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={replay}>
                <RotateCcw className="h-4 w-4" />
                {labels.replay}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
