import type { AlgorithmParams } from "./types";

export const defaultParams: AlgorithmParams = {
  insertIndex: 2,
  insertValue: 99,
  deleteIndex: 2,
  k: 3,
  cycleEnabled: true,
  cycleEntryIndex: 1,
  n: 2,
};

export type UpdateParam = <K extends keyof AlgorithmParams>(name: K, value: AlgorithmParams[K]) => void;

export function integerParam(value: number, fallback: number, min: number, max = Number.MAX_SAFE_INTEGER) {
  return Number.isFinite(value) ? Math.max(min, Math.min(max, Math.trunc(value))) : fallback;
}
