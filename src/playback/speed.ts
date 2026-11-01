import type { AlgorithmId } from "../algorithms";

export type SpeedMode = "slow" | "normal" | "fast";

export function getPlaybackDelay(speed: SpeedMode, algorithmId: AlgorithmId) {
  const delays: Record<SpeedMode, number> = {
    slow: 1400,
    normal: algorithmId === "reverseKGroup" ? 1200 : 880,
    fast: 560,
  };
  return delays[speed];
}
