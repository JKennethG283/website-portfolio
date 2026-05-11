"use client";

import { useMemo, useState } from "react";

import {
  type MarkovModel,
  type Move,
  createInitialModel,
  decideAiMove,
  roundResult,
  updateModel,
  parseModel,
} from "@/lib/rps/markov";

type RoundRecord = {
  userMove: Move;
  aiMove: Move;
  predictedUserMove: Move;
  result: "win" | "lose" | "draw";
};

const STORAGE_KEY = "rps-markov-model-v1";
const HISTORY_KEY = "rps-markov-history-v1";
const MAX_HISTORY_POINTS = 120;

const MOVE_EMOJI: Record<Move, string> = {
  rock: "✊",
  paper: "✋",
  scissors: "✌️",
};

const MOVE_LABEL: Record<Move, string> = {
  rock: "Rock",
  paper: "Paper",
  scissors: "Scissors",
};

function loadStoredModel(): MarkovModel {
  if (typeof window === "undefined") return createInitialModel();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialModel();
    const parsed = parseModel(JSON.parse(raw));
    return parsed ?? createInitialModel();
  } catch {
    return createInitialModel();
  }
}

function saveModel(model: MarkovModel) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(model));
}

function loadHistory(): Array<RoundRecord["result"]> {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (r): r is RoundRecord["result"] =>
        r === "win" || r === "lose" || r === "draw",
    );
  } catch {
    return [];
  }
}

function saveHistory(history: Array<RoundRecord["result"]>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

function buildWinRatePoints(
  history: Array<RoundRecord["result"]>,
  width: number,
  height: number,
) {
  if (history.length === 0) return "";
  let wins = 0;
  return history
    .map((result, i) => {
      if (result === "win") wins += 1;
      const x = history.length === 1 ? 0 : (i / (history.length - 1)) * width;
      const rate = wins / (i + 1); // 0..1
      const y = (1 - rate) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export function RpsMarkovGame() {
  const [model, setModel] = useState<MarkovModel>(() => loadStoredModel());
  const [previousUserMove, setPreviousUserMove] = useState<Move | null>(null);
  const [lastRound, setLastRound] = useState<RoundRecord | null>(null);
  const [history, setHistory] = useState<Array<RoundRecord["result"]>>(() =>
    loadHistory(),
  );

  const roundsPlayed = model.totalRounds;

  const winStats = useMemo(() => {
    if (!lastRound) return null;
    return lastRound.result === "win"
      ? "You win this round."
      : lastRound.result === "lose"
        ? "AI wins this round."
        : "Draw.";
  }, [lastRound]);

  const chartWidth = 540;
  const chartHeight = 180;
  const chartPoints = useMemo(
    () => buildWinRatePoints(history, chartWidth, chartHeight),
    [history],
  );
  const totalWins = useMemo(
    () => history.filter((h) => h === "win").length,
    [history],
  );
  const winRatePct = history.length ? (totalWins / history.length) * 100 : 0;

  const playRound = (userMove: Move) => {
    const { predictedUserMove, aiMove } = decideAiMove(model, previousUserMove);
    const result = roundResult(userMove, aiMove);
    const nextModel = updateModel(model, previousUserMove, userMove);

    setModel(nextModel);
    setPreviousUserMove(userMove);
    setLastRound({ userMove, aiMove, predictedUserMove, result });
    saveModel(nextModel);

    const nextHistory = [...history, result].slice(-MAX_HISTORY_POINTS);
    setHistory(nextHistory);
    saveHistory(nextHistory);
  };

  const resetLearning = () => {
    const fresh = createInitialModel();
    setModel(fresh);
    setPreviousUserMove(null);
    setLastRound(null);
    setHistory([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.localStorage.removeItem(HISTORY_KEY);
    }
  };

  return (
    <section className="rps-shell">
      <div className="rps-grid">
        <div className="rps-panel">
          <h2>Markov Rock-Paper-Scissors</h2>
          <p>
            This AI learns your move patterns using a first-order Markov model.
            After each round, it updates transition probabilities from your
            previous move to your current move.
          </p>
          <p>
            <strong>Rounds learned:</strong> {roundsPlayed}
          </p>

          <div className="rps-controls">
            {(["rock", "paper", "scissors"] as Move[]).map((move) => (
              <button
                key={move}
                type="button"
                className="rps-move-button"
                onClick={() => playRound(move)}
              >
                <span>{MOVE_EMOJI[move]}</span>
                {MOVE_LABEL[move]}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="button secondary rps-reset"
            onClick={resetLearning}
          >
            Reset AI memory
          </button>
        </div>

        <div className="rps-panel">
          <h3>Round insight</h3>
          {lastRound ? (
            <div className="rps-result-card">
              <p>
                <strong>You played:</strong> {MOVE_LABEL[lastRound.userMove]}{" "}
                {MOVE_EMOJI[lastRound.userMove]}
              </p>
              <p>
                <strong>AI predicted you would play:</strong>{" "}
                {MOVE_LABEL[lastRound.predictedUserMove]}{" "}
                {MOVE_EMOJI[lastRound.predictedUserMove]}
              </p>
              <p>
                <strong>AI played:</strong> {MOVE_LABEL[lastRound.aiMove]}{" "}
                {MOVE_EMOJI[lastRound.aiMove]}
              </p>
              <p>
                <strong>Outcome:</strong> {winStats}
              </p>
            </div>
          ) : (
            <p>Play your first round to start training the model.</p>
          )}

          <h3>Transition counts</h3>
          <div className="rps-table-wrap">
            <table className="rps-table" aria-label="Markov transition counts">
              <thead>
                <tr>
                  <th>Previous move</th>
                  <th>Next: Rock</th>
                  <th>Next: Paper</th>
                  <th>Next: Scissors</th>
                </tr>
              </thead>
              <tbody>
                {(["rock", "paper", "scissors"] as Move[]).map((from) => (
                  <tr key={from}>
                    <th scope="row">{MOVE_LABEL[from]}</th>
                    <td>{model.transitions[from].rock}</td>
                    <td>{model.transitions[from].paper}</td>
                    <td>{model.transitions[from].scissors}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3>Win-rate over time</h3>
          <p className="rps-chart-caption">
            Current win rate: <strong>{winRatePct.toFixed(1)}%</strong> (
            {totalWins}/{history.length || 0} wins)
          </p>
          <div className="rps-chart-wrap" aria-label="Win-rate chart over time">
            <svg
              className="rps-chart"
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              role="img"
              aria-label="Line chart of cumulative win rate over rounds"
            >
              <line x1="0" y1={chartHeight} x2={chartWidth} y2={chartHeight} />
              <line x1="0" y1="0" x2="0" y2={chartHeight} />
              <line
                className="rps-chart-midline"
                x1="0"
                y1={chartHeight / 2}
                x2={chartWidth}
                y2={chartHeight / 2}
              />
              {chartPoints ? (
                <polyline className="rps-chart-line" points={chartPoints} />
              ) : null}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
