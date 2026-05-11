import Link from "next/link";

import { RpsMarkovGame } from "@/ui/rps/RpsMarkovGame";

export default function RpsMarkovPage() {
  return (
    <main className="section">
      <div className="container">
        <div className="object-detection-header">
          <p className="section-label">Skill Demo</p>
          <h1>Rock-Paper-Scissors AI (Markov Model)</h1>
          <p className="hero-description">
            Play against an adaptive agent that learns your move transitions from
            round to round using a first-order Markov chain.
          </p>
          <Link href="/" className="button secondary">
            Back to portfolio
          </Link>
        </div>
      </div>
      <div className="container">
        <RpsMarkovGame />
      </div>
    </main>
  );
}
