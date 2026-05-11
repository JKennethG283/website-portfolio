import Link from "next/link";

import { FingerCounter } from "@/ui/object-detection/FingerCounter";

export default function ObjectDetectionPage() {
  return (
    <main className="section">
      <div className="container">
        <div className="object-detection-header">
          <p className="section-label">Skill Demo</p>
          <h1>Object Detection: Finger Counter</h1>
          <p className="hero-description">
            Real-time hand landmark detection using an existing model. Show your
            hand to the camera and the app estimates how many fingers are raised.
          </p>
          <Link href="/" className="button secondary">
            Back to portfolio
          </Link>
        </div>
      </div>
      <div className="container">
        <FingerCounter />
      </div>
    </main>
  );
}
