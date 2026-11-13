"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/Icons";

type Recognition = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: (e: {
    results: ArrayLike<
      ArrayLike<{ transcript: string }> & { isFinal: boolean }
    >;
  }) => void;
  onend: () => void;
  onerror: () => void;
  start: () => void;
  stop: () => void;
};

/** Dictation through the browser's speech recognition. Hidden where the browser has none. */
export function VoiceButton({ onText }: { onText: (t: string) => void }) {
  const [supported] = useState(
    () =>
      typeof window !== "undefined" &&
      !!(
        (window as unknown as Record<string, unknown>).SpeechRecognition ||
        (window as unknown as Record<string, unknown>).webkitSpeechRecognition
      ),
  );
  const [on, setOn] = useState(false);
  const rec = useRef<Recognition | null>(null);

  useEffect(() => () => rec.current?.stop(), []);

  if (!supported) return null;

  const toggle = () => {
    if (on) {
      rec.current?.stop();
      return;
    }
    const w = window as unknown as Record<string, new () => Recognition>;
    const R = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    const r = new R();
    r.lang = "en-AU";
    r.continuous = true;
    r.interimResults = false;
    r.onresult = (e) => {
      const last = e.results[e.results.length - 1];
      if (last?.isFinal) onText(last[0].transcript.trim());
    };
    r.onend = () => setOn(false);
    r.onerror = () => setOn(false);
    rec.current = r;
    setOn(true);
    r.start();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? "Stop dictating" : "Dictate"}
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
        on ? "bg-accent text-bg" : "text-ink-soft hover:bg-tint hover:text-ink"
      }`}
    >
      <Icon name="mic" className={`h-5 w-5 ${on ? "animate-pulse" : ""}`} />
    </button>
  );
}
