export type Move = "rock" | "paper" | "scissors";

export type TransitionCounts = Record<Move, Record<Move, number>>;

export type MarkovModel = {
  transitions: TransitionCounts;
  totalRounds: number;
};

export const MOVES: Move[] = ["rock", "paper", "scissors"];

export function createEmptyTransitions(): TransitionCounts {
  return {
    rock: { rock: 0, paper: 0, scissors: 0 },
    paper: { rock: 0, paper: 0, scissors: 0 },
    scissors: { rock: 0, paper: 0, scissors: 0 },
  };
}

export function createInitialModel(): MarkovModel {
  return {
    transitions: createEmptyTransitions(),
    totalRounds: 0,
  };
}

export function isMove(value: string): value is Move {
  return value === "rock" || value === "paper" || value === "scissors";
}

export function parseModel(raw: unknown): MarkovModel | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Partial<MarkovModel>;
  if (!obj.transitions || typeof obj.transitions !== "object") return null;
  if (typeof obj.totalRounds !== "number") return null;

  const transitions = obj.transitions as Partial<TransitionCounts>;
  for (const from of MOVES) {
    if (!transitions[from] || typeof transitions[from] !== "object") return null;
    for (const to of MOVES) {
      const n = (transitions[from] as Record<Move, unknown>)[to];
      if (typeof n !== "number" || n < 0) return null;
    }
  }

  return {
    transitions: transitions as TransitionCounts,
    totalRounds: Math.max(0, Math.floor(obj.totalRounds)),
  };
}

export function updateModel(
  model: MarkovModel,
  previousUserMove: Move | null,
  currentUserMove: Move,
): MarkovModel {
  const next: MarkovModel = {
    totalRounds: model.totalRounds + 1,
    transitions: {
      rock: { ...model.transitions.rock },
      paper: { ...model.transitions.paper },
      scissors: { ...model.transitions.scissors },
    },
  };

  if (previousUserMove) {
    next.transitions[previousUserMove][currentUserMove] += 1;
  }

  return next;
}

export function predictNextUserMove(
  model: MarkovModel,
  previousUserMove: Move | null,
): Move {
  if (!previousUserMove) return randomMove();

  const row = model.transitions[previousUserMove];
  const total = row.rock + row.paper + row.scissors;
  if (total <= 0) return randomMove();

  let best: Move = "rock";
  for (const move of MOVES) {
    if (row[move] > row[best]) best = move;
  }
  return best;
}

export function counterMove(move: Move): Move {
  switch (move) {
    case "rock":
      return "paper";
    case "paper":
      return "scissors";
    case "scissors":
      return "rock";
  }
}

export function randomMove(): Move {
  return MOVES[Math.floor(Math.random() * MOVES.length)];
}

export function decideAiMove(
  model: MarkovModel,
  previousUserMove: Move | null,
): { predictedUserMove: Move; aiMove: Move } {
  const predictedUserMove = predictNextUserMove(model, previousUserMove);
  return {
    predictedUserMove,
    aiMove: counterMove(predictedUserMove),
  };
}

export type RoundResult = "win" | "lose" | "draw";

export function roundResult(userMove: Move, aiMove: Move): RoundResult {
  if (userMove === aiMove) return "draw";
  if (
    (userMove === "rock" && aiMove === "scissors") ||
    (userMove === "paper" && aiMove === "rock") ||
    (userMove === "scissors" && aiMove === "paper")
  ) {
    return "win";
  }
  return "lose";
}
