"use client";

import {
  DrawingUtils,
  FilesetResolver,
  HandLandmarker,
  type HandLandmarkerResult,
} from "@mediapipe/tasks-vision";
import { useEffect, useMemo, useRef, useState } from "react";

const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task";
const WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm";

type HandCount = {
  handLabel: string;
  count: number;
};

const COUNT_HISTORY_SIZE = 7;
const CHANGE_STREAK_REQUIRED = 4;
const LOST_HAND_GRACE_FRAMES = 12;
const LANDMARK_SMOOTH_ALPHA = 0.32;

type StabilityState = {
  displayed: number;
  candidate: number;
  streak: number;
  lastSeenFrame: number;
};

type SimplePoint = {
  x: number;
  y: number;
  z: number;
  visibility: number;
};

function estimateHandScale(
  landmarks: HandLandmarkerResult["landmarks"][number],
): number {
  const wrist = landmarks[0];
  const middleMcp = landmarks[9];
  const dx = wrist.x - middleMcp.x;
  const dy = wrist.y - middleMcp.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function distance2D(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function angleDeg(
  a: { x: number; y: number },
  b: { x: number; y: number },
  c: { x: number; y: number },
) {
  const abx = a.x - b.x;
  const aby = a.y - b.y;
  const cbx = c.x - b.x;
  const cby = c.y - b.y;
  const dot = abx * cbx + aby * cby;
  const ab = Math.sqrt(abx * abx + aby * aby);
  const cb = Math.sqrt(cbx * cbx + cby * cby);
  const denom = ab * cb;
  if (denom <= 1e-6) return 0;
  const cos = Math.max(-1, Math.min(1, dot / denom));
  return (Math.acos(cos) * 180) / Math.PI;
}

function modeCount(values: number[]): number {
  const freq = new Map<number, number>();
  let bestValue = 0;
  let bestFreq = -1;
  for (const v of values) {
    const f = (freq.get(v) ?? 0) + 1;
    freq.set(v, f);
    if (f > bestFreq || (f === bestFreq && v > bestValue)) {
      bestValue = v;
      bestFreq = f;
    }
  }
  return bestValue;
}

function isBenignVisionMessage(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("xnnpack delegate") ||
    m.includes("created tensorflow lite") ||
    m.includes("wait for") ||
    m.includes("timestamp")
  );
}

function smoothLandmarks(
  prev: SimplePoint[] | undefined,
  curr: HandLandmarkerResult["landmarks"][number],
): SimplePoint[] {
  if (!prev || prev.length !== curr.length) {
    return curr.map((p) => ({
      x: p.x,
      y: p.y,
      z: p.z,
      visibility: p.visibility ?? 1,
    }));
  }
  return curr.map((p, i) => ({
    x: prev[i].x + (p.x - prev[i].x) * LANDMARK_SMOOTH_ALPHA,
    y: prev[i].y + (p.y - prev[i].y) * LANDMARK_SMOOTH_ALPHA,
    z: prev[i].z + (p.z - prev[i].z) * LANDMARK_SMOOTH_ALPHA,
    visibility: p.visibility ?? prev[i].visibility ?? 1,
  }));
}

function countRaisedFingers(
  landmarks: HandLandmarkerResult["landmarks"][number],
): number {
  if (!landmarks || landmarks.length < 21) return 0;

  let count = 0;
  const fingerTips = [8, 12, 16, 20];
  const fingerPips = [6, 10, 14, 18];
  const fingerMcps = [5, 9, 13, 17];
  const scale = estimateHandScale(landmarks);
  const yMargin = Math.max(0.016, scale * 0.14);

  // Non-thumb fingers: combine straightness + vertical position + extension ratio.
  for (let i = 0; i < fingerTips.length; i++) {
    const tip = landmarks[fingerTips[i]];
    const pip = landmarks[fingerPips[i]];
    const mcp = landmarks[fingerMcps[i]];

    const straightEnough = angleDeg(tip, pip, mcp) > 158;
    const raisedInY = tip.y < pip.y - yMargin;
    const extendedEnough =
      distance2D(tip, mcp) > distance2D(pip, mcp) * 1.18;

    if (straightEnough && raisedInY && extendedEnough) {
      count += 1;
    }
  }

  // Thumb: use geometry-only checks (no left/right assumption).
  const thumbTip = landmarks[4];
  const thumbIp = landmarks[3];
  const thumbMcp = landmarks[2];
  const indexMcp = landmarks[5];
  const pinkyMcp = landmarks[17];
  const thumbExtended =
    distance2D(thumbTip, thumbMcp) > distance2D(thumbIp, thumbMcp) * 1.1;
  const thumbStraight = angleDeg(thumbTip, thumbIp, thumbMcp) > 132;
  const thumbFarEnough =
    distance2D(thumbTip, indexMcp) > scale * 0.33 &&
    distance2D(thumbTip, pinkyMcp) > scale * 0.48;
  const thumbSpread =
    distance2D(thumbTip, indexMcp) > distance2D(thumbIp, indexMcp) * 1.01;
  if (thumbExtended && thumbFarEnough && (thumbStraight || thumbSpread)) count += 1;

  return count;
}

export function FingerCounter() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const handLandmarkerRef = useRef<HandLandmarker | null>(null);
  const animationRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastVideoTimeRef = useRef(-1);
  const historyRef = useRef<Map<string, number[]>>(new Map());
  const stabilityRef = useRef<Map<string, StabilityState>>(new Map());
  const smoothedLandmarksRef = useRef<Map<string, SimplePoint[]>>(new Map());
  const frameRef = useRef(0);
  const errorRef = useRef<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [counts, setCounts] = useState<HandCount[]>([]);

  const totalCount = useMemo(
    () => counts.reduce((sum, h) => sum + h.count, 0),
    [counts],
  );

  useEffect(() => {
    let mounted = true;

    const stopEverything = () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (handLandmarkerRef.current) {
        handLandmarkerRef.current.close();
        handLandmarkerRef.current = null;
      }
    };

    const predictLoop = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const handLandmarker = handLandmarkerRef.current;
      if (!video || !canvas || !handLandmarker) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      if (
        video.videoWidth > 0 &&
        video.videoHeight > 0 &&
        video.readyState >= 2 &&
        !video.paused &&
        !video.ended
      ) {
        if (
          canvas.width !== video.videoWidth ||
          canvas.height !== video.videoHeight
        ) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
        }

        let result: HandLandmarkerResult | undefined;
        if (video.currentTime !== lastVideoTimeRef.current) {
          lastVideoTimeRef.current = video.currentTime;
          try {
            result = handLandmarker.detectForVideo(video, performance.now());
            if (errorRef.current) {
              errorRef.current = null;
              setError(null);
            }
          } catch (err) {
            const msg =
              err instanceof Error
                ? err.message
                : "Object detection frame failed.";
            if (!isBenignVisionMessage(msg)) {
              errorRef.current = msg;
              setError(msg);
            }
          }
        }

        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const drawingUtils = new DrawingUtils(ctx);

        if (result?.landmarks?.length) {
          frameRef.current += 1;
          const frameId = frameRef.current;
          const seenKeys = new Set<string>();

          const drawLandmarks: SimplePoint[][] = [];
          const handCounts: HandCount[] = result.landmarks.map((landmarks, i) => {
            const label = result?.handednesses?.[i]?.[0]?.categoryName ?? "Hand";
            const rawCount = countRaisedFingers(landmarks);

            const key = label === "Hand" ? `${label}-${i}` : label;
            seenKeys.add(key);

            const smoothed = smoothLandmarks(
              smoothedLandmarksRef.current.get(key),
              landmarks,
            );
            smoothedLandmarksRef.current.set(key, smoothed);
            drawLandmarks.push(smoothed);

            const prev = historyRef.current.get(key) ?? [];
            const next = [...prev, rawCount].slice(-COUNT_HISTORY_SIZE);
            historyRef.current.set(key, next);

            const smoothedCount = modeCount(next);
            const stable = stabilityRef.current.get(key);

            if (!stable) {
              stabilityRef.current.set(key, {
                displayed: smoothedCount,
                candidate: smoothedCount,
                streak: 0,
                lastSeenFrame: frameId,
              });
              return { handLabel: label, count: smoothedCount };
            }

            stable.lastSeenFrame = frameId;
            if (smoothedCount === stable.displayed) {
              stable.candidate = smoothedCount;
              stable.streak = 0;
            } else if (smoothedCount === stable.candidate) {
              stable.streak += 1;
              if (stable.streak >= CHANGE_STREAK_REQUIRED) {
                stable.displayed = smoothedCount;
                stable.streak = 0;
              }
            } else {
              stable.candidate = smoothedCount;
              stable.streak = 1;
            }

            return { handLabel: label, count: stable.displayed };
          });

          // Keep last displayed value briefly when a hand flickers out.
          const staleThreshold = frameId - LOST_HAND_GRACE_FRAMES;
          stabilityRef.current.forEach((state, key) => {
            if (!seenKeys.has(key) && state.lastSeenFrame < staleThreshold) {
              stabilityRef.current.delete(key);
              historyRef.current.delete(key);
              smoothedLandmarksRef.current.delete(key);
            }
          });

          setCounts(handCounts);

          drawLandmarks.forEach((landmarks) => {
            drawingUtils.drawConnectors(
              landmarks,
              HandLandmarker.HAND_CONNECTIONS,
              { color: "#0d6efd", lineWidth: 2 },
            );
            drawingUtils.drawLandmarks(landmarks, {
              color: "#0b5ed7",
              fillColor: "#ffffff",
              radius: 3,
            });
          });
        } else {
          frameRef.current += 1;
          const frameId = frameRef.current;
          const staleThreshold = frameId - LOST_HAND_GRACE_FRAMES;
          const hold: HandCount[] = [];
          stabilityRef.current.forEach((state, key) => {
            if (state.lastSeenFrame >= staleThreshold) {
              hold.push({ handLabel: key.replace(/-\d+$/, ""), count: state.displayed });
            } else {
              stabilityRef.current.delete(key);
              historyRef.current.delete(key);
              smoothedLandmarksRef.current.delete(key);
            }
          });
          setCounts(hold);
        }

        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(predictLoop);
    };

    const init = async () => {
      try {
        const media = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });

        const video = videoRef.current;
        if (!video) {
          throw new Error("Camera preview element is missing.");
        }

        streamRef.current = media;
        video.srcObject = media;
        await video.play();

        const filesetResolver = await FilesetResolver.forVisionTasks(WASM_URL);
        const handLandmarker = await HandLandmarker.createFromOptions(
          filesetResolver,
          {
            baseOptions: { modelAssetPath: MODEL_URL },
            runningMode: "VIDEO",
            numHands: 2,
          },
        );
        handLandmarkerRef.current = handLandmarker;

        if (!mounted) return;
        setLoading(false);
        predictLoop();
      } catch (err) {
        if (!mounted) return;
        const msg =
          err instanceof Error ? err.message : "Unable to start object detection.";
        errorRef.current = msg;
        setError(msg);
        setLoading(false);
      }
    };

    init();
    return () => {
      mounted = false;
      stopEverything();
    };
  }, []);

  return (
    <section className="detector-shell">
      <div className="detector-grid">
        <div className="detector-panel">
          <h2>Hand Object Detection (Existing Model)</h2>
          <p>
            This demo uses MediaPipe Hand Landmarker to detect your hand landmarks
            and estimate how many fingers are raised in real time.
          </p>
          <ul>
            <li>Allow camera access when prompted.</li>
            <li>Use one or both hands in frame.</li>
            <li>Best results with good lighting and a plain background.</li>
          </ul>
          <div className="detector-stats">
            <p>
              <strong>Total fingers:</strong> {totalCount}
            </p>
            {counts.length ? (
              <div className="detector-breakdown">
                {counts.map((item, idx) => (
                  <p key={`${item.handLabel}-${idx}`}>
                    {item.handLabel}: {item.count}
                  </p>
                ))}
              </div>
            ) : (
              <p>No hands detected yet.</p>
            )}
          </div>
        </div>

        <div className="detector-view">
          <video ref={videoRef} className="detector-video" playsInline muted />
          <canvas ref={canvasRef} className="detector-canvas" />
          {loading ? <div className="detector-overlay">Loading camera/model…</div> : null}
          {error ? <div className="detector-overlay detector-error">{error}</div> : null}
        </div>
      </div>
    </section>
  );
}
