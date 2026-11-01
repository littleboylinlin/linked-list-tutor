export type PlaybackState = {
  index: number;
  isPlaying: boolean;
};

export type PlaybackAction = "previous" | "next" | "tick" | "toggle" | "pause" | "reset";

export const initialPlaybackState: PlaybackState = { index: 0, isPlaying: false };

export function reducePlayback(
  state: PlaybackState,
  action: PlaybackAction,
  stepCount: number,
): PlaybackState {
  const lastIndex = Math.max(0, stepCount - 1);
  const index = Math.max(0, Math.min(state.index, lastIndex));

  switch (action) {
    case "reset":
      return initialPlaybackState;
    case "pause":
      return { index, isPlaying: false };
    case "previous":
      return { index: Math.max(0, index - 1), isPlaying: false };
    case "next":
      return { index: Math.min(lastIndex, index + 1), isPlaying: false };
    case "tick": {
      const nextIndex = Math.min(lastIndex, index + 1);
      return { index: nextIndex, isPlaying: state.isPlaying && nextIndex < lastIndex };
    }
    case "toggle":
      return { index, isPlaying: index < lastIndex && !state.isPlaying };
  }
}
