/**
 * Browser speech-to-text (Web Speech API). Chrome / Edge: full support.
 * Safari: partial. Firefox: often unavailable without flags.
 */

export type WebSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((ev: WebSpeechRecognitionEvent) => void) | null;
  onerror: ((ev: WebSpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
};

export type WebSpeechRecognitionEvent = {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
};

type SpeechRecognitionResultListLike = {
  length: number;
  item(index: number): SpeechRecognitionResultLike;
  [index: number]: SpeechRecognitionResultLike;
};

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  readonly length: number;
  item(index: number): { transcript: string };
  [index: number]: { transcript: string };
};

export type WebSpeechRecognitionErrorEvent = {
  error: string;
};

type RecognitionCtor = new () => WebSpeechRecognition;

export function getSpeechRecognitionCtor(): RecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as Window &
    typeof globalThis & {
      SpeechRecognition?: RecognitionCtor;
      webkitSpeechRecognition?: RecognitionCtor;
    };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function collectFinalTranscript(ev: WebSpeechRecognitionEvent): string {
  let text = "";
  const { results, resultIndex } = ev;
  for (let i = resultIndex; i < results.length; i++) {
    const row = results[i];
    if (row.isFinal) {
      text += row[0]?.transcript ?? "";
    }
  }
  return text.replace(/\s+/g, " ").trim();
}
