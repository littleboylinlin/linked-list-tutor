import { useCallback, useEffect, useState } from "react";
import { initialPlaybackState, reducePlayback, type PlaybackAction } from "../playback/state";

type PlaybackOptions<T> = {
  delay: number;
  pauseAt?: (step: T) => boolean;
};

export function useStepPlayback<T>(steps: readonly T[], { delay, pauseAt }: PlaybackOptions<T>) {
  const [session, setSession] = useState(() => ({
    timeline: steps,
    state: initialPlaybackState,
  }));

  // A new timeline starts at zero immediately, before any effect or timer runs.
  const state = session.timeline === steps ? session.state : initialPlaybackState;
  const index = Math.min(state.index, Math.max(0, steps.length - 1));
  const step = steps[index];
  const blocked = step !== undefined && Boolean(pauseAt?.(step));
  const canNext = index < steps.length - 1;
  const isPlaying = state.isPlaying && canNext && !blocked;

  const dispatch = useCallback((action: PlaybackAction) => {
    setSession((previous) => ({
      timeline: steps,
      state: reducePlayback(
        previous.timeline === steps ? previous.state : initialPlaybackState,
        action,
        steps.length,
      ),
    }));
  }, [steps]);

  useEffect(() => {
    if (!state.isPlaying) return;
    if (!canNext || blocked) {
      dispatch("pause");
      return;
    }

    const timer = window.setTimeout(() => dispatch("tick"), delay);
    return () => window.clearTimeout(timer);
  }, [blocked, canNext, delay, dispatch, index, state.isPlaying]);

  return {
    step,
    index,
    isPlaying,
    canPrev: index > 0,
    canNext,
    previous: () => dispatch("previous"),
    next: () => dispatch("next"),
    reset: () => dispatch("reset"),
    togglePlay: () => dispatch(blocked ? "pause" : "toggle"),
  };
}
