"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import {
  collectFinalTranscript,
  getSpeechRecognitionCtor,
  type WebSpeechRecognition,
  type WebSpeechRecognitionErrorEvent,
  type WebSpeechRecognitionEvent,
} from "./web-speech";

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="23" />
      <line x1="8" x2="16" y1="23" y2="23" />
    </svg>
  );
}

function speechErrorMessage(code: string): string {
  switch (code) {
    case "not-allowed":
      return "Microphone access was denied. Allow the mic for this site in your browser settings.";
    case "no-speech":
      return "No speech detected. Try again and speak clearly.";
    case "audio-capture":
      return "No microphone found. Check that a mic is connected.";
    case "network":
      return "Voice recognition needs a network connection in this browser.";
    case "aborted":
      return "";
    default:
      return "Voice input could not complete. Try again or type your message.";
  }
}

export function JonathanChatbot() {
  const panelId = useId();
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [listening, setListening] = useState(false);
  const [speechHint, setSpeechHint] = useState<string | null>(null);

  const sttSupported = useSyncExternalStore(
    () => () => {},
    () => Boolean(getSpeechRecognitionCtor()),
    () => false,
  );
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<WebSpeechRecognition | null>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const busy = status === "submitted" || status === "streaming";

  const stopRecognition = useCallback(() => {
    const r = recognitionRef.current;
    if (!r) return;
    try {
      r.stop();
    } catch {
      try {
        r.abort();
      } catch {
        /* ignore */
      }
    }
    setListening(false);
  }, []);

  useEffect(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-AU";

    recognition.onresult = (ev) => {
      const t = collectFinalTranscript(ev as unknown as WebSpeechRecognitionEvent);
      if (t) {
        setInputValue((prev) => (prev.trim() ? `${prev.trim()} ` : "") + t);
        setSpeechHint(null);
      }
    };

    recognition.onerror = (ev) => {
      const code = (ev as WebSpeechRecognitionErrorEvent).error;
      const msg = speechErrorMessage(code);
      if (msg) setSpeechHint(msg);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
    return () => {
      try {
        recognition.abort();
      } catch {
        /* ignore */
      }
      recognitionRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      return;
    }
    stopRecognition();
    queueMicrotask(() => {
      setSpeechHint(null);
    });
  }, [open, stopRecognition]);

  useEffect(() => {
    if (!busy) return;
    const r = recognitionRef.current;
    if (!r) return;
    try {
      r.abort();
    } catch {
      try {
        r.stop();
      } catch {
        /* ignore */
      }
    }
    setListening(false);
  }, [busy]);

  const toggleSpeech = () => {
    const r = recognitionRef.current;
    if (!r || busy) return;
    if (listening) {
      stopRecognition();
      return;
    }
    setSpeechHint(null);
    try {
      r.start();
      setListening(true);
    } catch {
      setSpeechHint("Could not start voice input. Try again.");
      setListening(false);
    }
  };

  return (
    <>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full border border-[#dce4ef] bg-[#0d6efd] px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#0b5ed7]"
          aria-expanded={false}
          aria-controls={panelId}
        >
          Ask about Jonathan
        </button>
      ) : null}

      <aside
        id={panelId}
        aria-hidden={!open}
        aria-labelledby={titleId}
        className={`fixed inset-y-0 right-0 z-40 flex w-full max-w-md flex-col border-l border-[#dce4ef] bg-white shadow-xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}
      >
        <header className="flex items-center justify-between gap-3 border-b border-[#dce4ef] bg-[#f4f7fb] px-4 py-3">
          <div>
            <h2
              id={titleId}
              className="text-base font-semibold text-[#0c1222]"
            >
              Portfolio assistant
            </h2>
            <p className="text-xs text-[#6b7a93]">
              Answers use public profile context when relevant.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg border border-[#dce4ef] bg-white px-3 py-1.5 text-sm font-medium text-[#3d4a63] transition hover:border-[#c5d0e0] hover:bg-[#f4f7fb]"
            aria-label="Close chat panel"
          >
            Close
          </button>
        </header>

        <div className="flex min-h-0 flex-1 flex-col gap-3 bg-white">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-3 text-sm">
            {messages.length === 0 && (
              <p className="text-[#3d4a63]">
                Ask about Jonathan&apos;s studies at UTS, projects (crypto
                forecasting, Indonesian markets), skills, or career interests.
                {sttSupported ? " Use the microphone button to dictate." : ""}
              </p>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col gap-1 ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-[#6b7a93]">
                  {message.role === "user" ? "You" : "Assistant"}
                </span>
                <div
                  className={`max-w-[95%] rounded-2xl px-3 py-2 leading-relaxed ${
                    message.role === "user"
                      ? "bg-[#0d6efd] text-white"
                      : "bg-[#f4f7fb] text-[#0c1222] ring-1 ring-[#dce4ef]"
                  }`}
                >
                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      <span key={index} className="whitespace-pre-wrap">
                        {part.text}
                      </span>
                    ) : null,
                  )}
                </div>
              </div>
            ))}
            {busy && (
              <p className="text-xs text-[#6b7a93]">Thinking…</p>
            )}
            {error && (
              <div className="space-y-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                <p>
                  Something went wrong. If this persists, the chat service may not
                  be configured for this deployment.
                </p>
                {process.env.NODE_ENV === "development" ? (
                  <p className="font-mono text-xs opacity-90">
                    {error.message ||
                      (typeof error === "string" ? error : String(error))}
                  </p>
                ) : null}
              </div>
            )}
          </div>

          <form
            className="border-t border-[#dce4ef] bg-[#f4f7fb] p-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (listening) stopRecognition();
              const text = inputValue.trim();
              if (!text || busy) return;
              sendMessage({ text });
              setInputValue("");
            }}
          >
            <label htmlFor={`${panelId}-input`} className="sr-only">
              Message
            </label>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                id={`${panelId}-input`}
                name="message"
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  if (speechHint) setSpeechHint(null);
                }}
                placeholder="Ask a question…"
                disabled={busy}
                autoComplete="off"
                className="min-w-0 flex-1 rounded-lg border border-[#dce4ef] bg-white px-3 py-2 text-sm text-[#0c1222] outline-none ring-[#0d6efd]/30 placeholder:text-[#6b7a93] focus:ring-2"
              />
              {sttSupported ? (
                <button
                  type="button"
                  onClick={toggleSpeech}
                  disabled={busy}
                  aria-pressed={listening}
                  aria-label={
                    listening ? "Stop voice input" : "Start voice input"
                  }
                  title={
                    listening
                      ? "Stop listening"
                      : "Speak your question (browser speech-to-text)"
                  }
                  className={`flex h-[38px] w-[42px] shrink-0 items-center justify-center rounded-lg border text-white transition disabled:opacity-50 ${
                    listening
                      ? "border-red-300 bg-red-500 hover:bg-red-600"
                      : "border-[#93c5fd] bg-[#0d6efd] hover:bg-[#0b5ed7]"
                  }`}
                >
                  <MicIcon />
                </button>
              ) : null}
              <button
                type="submit"
                disabled={busy}
                className="shrink-0 rounded-lg bg-[#0d6efd] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#0b5ed7] disabled:opacity-50"
              >
                Send
              </button>
            </div>
            {speechHint ? (
              <p
                className="mt-2 text-xs text-[#b45309]"
                role="status"
                aria-live="polite"
              >
                {speechHint}
              </p>
            ) : listening ? (
              <p
                className="mt-2 text-xs text-[#0d6efd]"
                role="status"
                aria-live="polite"
              >
                Listening… speak now. Tap the mic again to stop.
              </p>
            ) : null}
          </form>
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          aria-label="Dismiss chat overlay"
          className="fixed inset-0 z-30 bg-[#0c1222]/20"
          onClick={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
