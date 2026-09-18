"use client";

import "./signal.css";

import {
  AssistantOrb,
  assistantStateLabels,
  type AssistantState,
} from "./AssistantOrb";
import { RobotMascot } from "./RobotMascot";
import { AssistantMessage } from "./AssistantMessage";

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
  const panelRef = useRef<HTMLElement>(null);
  const messagesScrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<WebSpeechRecognition | null>(null);

  const {
    messages,
    sendMessage,
    status,
    error,
    stop,
    regenerate,
    setMessages,
    clearError,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const busy = status === "submitted" || status === "streaming";
  const orbState: AssistantState = listening
    ? "listening"
    : status === "submitted"
      ? "thinking"
      : status === "streaming"
        ? "replying"
        : error
          ? "error"
          : inputValue.trim()
            ? "receiving"
            : "idle";

  useLayoutEffect(() => {
    if (!open) return;
    const el = messagesScrollRef.current;
    if (!el) return;
    const snapToBottom = () => {
      el.scrollTop = el.scrollHeight;
    };
    snapToBottom();
    const frame = requestAnimationFrame(snapToBottom);
    return () => cancelAnimationFrame(frame);
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
      const t = collectFinalTranscript(
        ev as unknown as WebSpeechRecognitionEvent,
      );
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
      const viewport = window.visualViewport;
      const fitViewport = () => {
        panelRef.current?.style.setProperty(
          "--chat-viewport-height",
          `${viewport?.height ?? window.innerHeight}px`,
        );
        panelRef.current?.style.setProperty(
          "--chat-viewport-top",
          `${viewport?.offsetTop ?? 0}px`,
        );
      };
      fitViewport();
      viewport?.addEventListener("resize", fitViewport);
      viewport?.addEventListener("scroll", fitViewport);
      inputRef.current?.focus();
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const content = document.getElementById("site-content");
      if (content) content.inert = true;
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape") setOpen(false);
        if (event.key !== "Tab") return;
        const controls = panelRef.current?.querySelectorAll<HTMLElement>(
          'button:not(:disabled), input:not(:disabled), a[href], [tabindex="0"]',
        );
        const first = controls?.[0];
        const last = controls?.[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      };
      document.addEventListener("keydown", onKeyDown);
      return () => {
        viewport?.removeEventListener("resize", fitViewport);
        viewport?.removeEventListener("scroll", fitViewport);
        document.body.style.overflow = previousOverflow;
        if (content) content.inert = false;
        document.removeEventListener("keydown", onKeyDown);
        document.querySelector<HTMLButtonElement>(".mascot-button")?.focus();
      };
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

  const ask = (text: string) => {
    if (!text.trim() || busy) return;
    if (listening) stopRecognition();
    void sendMessage({ text: text.trim() });
    setInputValue("");
    inputRef.current?.focus();
  };

  return (
    <>
      <RobotMascot open={open} panelId={panelId} onOpen={() => setOpen(true)} />
      {open && (
        <div
          className="assistant-backdrop"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        ref={panelRef}
        id={panelId}
        role="dialog"
        aria-modal={open ? true : undefined}
        aria-hidden={!open}
        inert={!open}
        aria-labelledby={titleId}
        className={`signal-panel${open ? " is-open" : ""}`}
      >
        <header className="signal-panel-header">
          <div className="signal-identity">
            <span className="signal-dot" />
            <span>
              SIGNAL <span className="signal-identity-divider">/</span>{" "}
              PORTFOLIO GUIDE
            </span>
          </div>
          <div className="signal-header-actions">
            {messages.length > 0 && (
              <button
                type="button"
                className="signal-icon-button"
                disabled={busy}
                aria-label="Start a new conversation"
                title="New conversation"
                onClick={() => {
                  setMessages([]);
                  clearError();
                  setInputValue("");
                  inputRef.current?.focus();
                }}
              >
                ↺
              </button>
            )}
            <button
              type="button"
              className="signal-icon-button"
              aria-label="Close chat panel"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
        </header>
        <div
          className={`signal-presence${messages.length ? " signal-presence--compact" : ""}`}
        >
          <AssistantOrb state={orbState} />
          <div>
            <h2 id={titleId}>
              {messages.length
                ? "A little signal. A little clarity."
                : "Hello, curious human."}
            </h2>
            <p className="signal-state" role="status">
              {assistantStateLabels[orbState]}
            </p>
          </div>
        </div>
        <div className="signal-conversation" ref={messagesScrollRef}>
          {messages.length === 0 && (
            <div className="signal-welcome">
              <p>
                I’m Signal, Jonathan’s AI guide.
                <br />
                Let’s explore what he’s building.
              </p>
              <div
                className="signal-suggestions"
                aria-label="Suggested questions"
              >
                {[
                  [
                    "Explore the work",
                    "What has Jonathan been building recently?",
                  ],
                  [
                    "Behind the code",
                    "What are Jonathan's strengths and technical skills?",
                  ],
                  [
                    "Meet Jonathan",
                    "Tell me about Jonathan's journey and his role as an AI and Software Engineer at Gradstack.",
                  ],
                ].map(([label, prompt]) => (
                  <button type="button" key={label} onClick={() => ask(prompt)}>
                    <span>{label}</span>
                    <span aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
              <span className="signal-welcome-note">
                Projects, experience, and the person behind them.
              </span>
            </div>
          )}
          <div
            className="signal-message-list"
            role="log"
            aria-label="Conversation"
            aria-live="polite"
            aria-busy={busy}
          >
            {messages.map((message) => (
              <article
                key={message.id}
                className={`signal-message signal-message--${message.role}`}
              >
                <span className="signal-message-author">
                  {message.role === "user" ? "YOU" : "SIGNAL"}
                </span>
                <div>
                  {message.parts.map((part, i) =>
                    part.type === "text" ? (
                      message.role === "assistant" ? (
                        <AssistantMessage key={i} text={part.text} />
                      ) : (
                        <span key={i}>{part.text}</span>
                      )
                    ) : null,
                  )}
                </div>
              </article>
            ))}
          </div>
          {status === "submitted" && (
            <div className="signal-thinking">
              <AssistantOrb state="thinking" small />
              <span>Looking through Jonathan’s work…</span>
            </div>
          )}
          {error && (
            <div className="signal-error" role="alert">
              <p>
                I couldn’t connect just now. Your conversation is still here.
              </p>
              <button
                type="button"
                onClick={() => {
                  void regenerate();
                }}
              >
                Try again ↗
              </button>
              <a href="mailto:jonathan.kenneth.gunawan@gmail.com">
                Contact Jonathan instead
              </a>
            </div>
          )}
        </div>
        <form
          className="signal-composer"
          onSubmit={(event) => {
            event.preventDefault();
            ask(inputValue);
          }}
        >
          <label htmlFor={`${panelId}-input`} className="sr-only">
            Message Signal
          </label>
          <div className="signal-input-row">
            <input
              ref={inputRef}
              id={`${panelId}-input`}
              name="message"
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value);
                if (speechHint) setSpeechHint(null);
              }}
              placeholder="What are you curious about?"
              autoComplete="off"
            />
            {sttSupported && (
              <button
                type="button"
                className="signal-mic"
                onClick={toggleSpeech}
                disabled={busy}
                aria-pressed={listening}
                aria-label={
                  listening ? "Stop voice input" : "Start voice input"
                }
                title="Speak your question; it sends when you finish"
              >
                <MicIcon />
              </button>
            )}
            {busy ? (
              <button
                type="button"
                className="signal-send"
                onClick={() => {
                  void stop();
                }}
                aria-label="Stop response"
              >
                <span className="signal-stop-square" />
              </button>
            ) : (
              <button
                type="submit"
                className="signal-send"
                disabled={!inputValue.trim()}
                aria-label="Send message"
              >
                ↑
              </button>
            )}
          </div>
          {speechHint ? (
            <p className="signal-speech-hint" role="status">
              {speechHint}
            </p>
          ) : listening ? (
            <p className="signal-speech-hint" role="status">
              Listening… your question sends when you finish.
            </p>
          ) : null}
          <p className="signal-disclaimer">
            AI guide · Based on Jonathan’s public portfolio · Can make mistakes
          </p>
        </form>
      </aside>
    </>
  );
}
