"use client";

import "./chat-panel.css";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
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

function AssistantAvatar({
  thinking,
  className = "",
}: {
  thinking?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e8f1ff] text-[#0d6efd] ring-1 ring-[#dce4ef] ${
        thinking ? "chat-assistant-avatar--thinking" : ""
      } ${className}`.trim()}
      aria-hidden
    >
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
      >
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" />
        <path d="M19 17v4" />
        <path d="M3 5h4" />
        <path d="M17 19h4" />
      </svg>
    </span>
  );
}

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
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<WebSpeechRecognition | null>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const busy = status === "submitted" || status === "streaming";

  useLayoutEffect(() => {
    if (!open) return;
    const el = messagesScrollRef.current;
    if (!el) return;
    const snapToBottom = () => {
      el.scrollTop = el.scrollHeight;
    };
    snapToBottom();
    requestAnimationFrame(snapToBottom);
  }, [open, messages, status, busy, error]);

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

  const inputValueRef = useRef(inputValue);
  const busyRef = useRef(busy);
  const sendMessageRef = useRef(sendMessage);
  const stopRecognitionRef = useRef(stopRecognition);

  useEffect(() => {
    inputValueRef.current = inputValue;
    busyRef.current = busy;
    sendMessageRef.current = sendMessage;
    stopRecognitionRef.current = stopRecognition;
  }, [inputValue, busy, sendMessage, stopRecognition]);

  useEffect(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    const recognition = new Ctor();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-AU";

    recognition.onresult = (ev) => {
      const t = collectFinalTranscript(ev as unknown as WebSpeechRecognitionEvent);
      if (!t) return;
      setSpeechHint(null);

      const prev = inputValueRef.current;
      const full = (prev.trim() ? `${prev.trim()} ` : "") + t;

      stopRecognitionRef.current();

      const trimmed = full.trim();
      if (!trimmed) return;

      if (busyRef.current) {
        setInputValue(trimmed);
        return;
      }

      sendMessageRef.current({ text: trimmed });
      setInputValue("");
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
          <div
            ref={messagesScrollRef}
            className="chat-messages-scroll min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden px-4 py-3 text-sm"
          >
            {messages.length === 0 && (
              <p className="text-[#3d4a63]">
                Ask about Jonathan&apos;s studies at UTS, projects (crypto
                forecasting, Indonesian markets), skills, or career interests.
                {sttSupported
                  ? " Use the microphone button to dictate—your message sends automatically when you finish speaking."
                  : ""}
              </p>
            )}
            {messages.map((message, index) => {
              const isAssistant = message.role === "assistant";
              const isLast = index === messages.length - 1;
              const avatarThinking = isAssistant && isLast && busy;

              if (message.role === "user") {
                return (
                  <div
                    key={message.id}
                    className="flex flex-col items-end gap-1"
                  >
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#6b7a93]">
                      You
                    </span>
                    <div
                      className="chat-bubble-user max-w-[95%] rounded-2xl bg-[#0d6efd] px-3 py-2 leading-relaxed text-white"
                    >
                      {message.parts.map((part, i) =>
                        part.type === "text" ? (
                          <span key={i} className="whitespace-pre-wrap">
                            {part.text}
                          </span>
                        ) : null,
                      )}
                    </div>
                  </div>
                );
              }

              return (
                <div key={message.id} className="flex gap-2">
                  <AssistantAvatar thinking={avatarThinking} />
                  <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-[#6b7a93]">
                      Assistant
                    </span>
                    <div className="chat-bubble-assistant max-w-[95%] rounded-2xl bg-[#f4f7fb] px-3 py-2 leading-relaxed text-[#0c1222] ring-1 ring-[#dce4ef]">
                      {message.parts.map((part, i) =>
                        part.type === "text" ? (
                          <span key={i} className="whitespace-pre-wrap">
                            {part.text}
                          </span>
                        ) : null,
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            {busy && messages[messages.length - 1]?.role !== "assistant" ? (
              <div className="flex items-center gap-2">
                <AssistantAvatar thinking />
                <p className="flex items-center gap-0.5 text-xs text-[#6b7a93]">
                  <span>Thinking</span>
                  <span className="chat-thinking-dot">.</span>
                  <span className="chat-thinking-dot">.</span>
                  <span className="chat-thinking-dot">.</span>
                </p>
              </div>
            ) : null}
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
                className={`min-w-0 flex-1 rounded-lg border border-[#dce4ef] bg-white px-3 py-2 text-sm text-[#0c1222] outline-none ring-[#0d6efd]/30 placeholder:text-[#6b7a93] focus:ring-2 ${
                  busy ? "chat-input--busy" : ""
                }`}
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
                      : "Speak your question—it sends when you finish speaking"
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
                Listening… speak now. Your message will send when you stop.
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
