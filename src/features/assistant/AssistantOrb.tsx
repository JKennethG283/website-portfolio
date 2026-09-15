export type AssistantState =
  "idle" | "receiving" | "listening" | "thinking" | "replying" | "error";

export const assistantStateLabels: Record<AssistantState, string> = {
  idle: "Ready when you are",
  receiving: "A thought taking shape",
  listening: "Listening to you",
  thinking: "Connecting the dots",
  replying: "Sending a signal",
  error: "Connection interrupted",
};

export function AssistantOrb({
  state,
  small = false,
}: {
  state: AssistantState;
  small?: boolean;
}) {
  return (
    <div
      className={`assistant-orb${small ? " assistant-orb--small" : ""}`}
      data-state={state}
      aria-hidden="true"
    >
      <span className="orb-orbit orb-orbit--one" />
      <span className="orb-orbit orb-orbit--two" />
      <span className="orb-sphere">
        <span className="orb-current" />
        <span className="orb-shine" />
      </span>
      <span className="orb-ripple" />
    </div>
  );
}
