import assert from "node:assert/strict";
import test from "node:test";
import { initialPlaybackState, reducePlayback } from "../src/playback/state";

test("manual navigation pauses and stays inside the timeline", () => {
  const playing = { index: 1, isPlaying: true };
  assert.deepEqual(reducePlayback(playing, "previous", 4), { index: 0, isPlaying: false });
  assert.deepEqual(reducePlayback(playing, "next", 4), { index: 2, isPlaying: false });
  assert.deepEqual(reducePlayback(initialPlaybackState, "previous", 4), initialPlaybackState);
  assert.deepEqual(reducePlayback({ index: 3, isPlaying: false }, "next", 4), { index: 3, isPlaying: false });
});

test("autoplay stops on the final frame", () => {
  let state = reducePlayback(initialPlaybackState, "toggle", 3);
  assert.equal(state.isPlaying, true);
  state = reducePlayback(state, "tick", 3);
  assert.deepEqual(state, { index: 1, isPlaying: true });
  state = reducePlayback(state, "tick", 3);
  assert.deepEqual(state, { index: 2, isPlaying: false });
  assert.deepEqual(reducePlayback(state, "toggle", 3), state);
});

test("pause and reset have separate behavior", () => {
  const state = { index: 2, isPlaying: true };
  assert.deepEqual(reducePlayback(state, "pause", 4), { index: 2, isPlaying: false });
  assert.deepEqual(reducePlayback(state, "reset", 4), initialPlaybackState);
});

test("empty and single-frame timelines cannot autoplay", () => {
  for (const count of [0, 1]) {
    assert.deepEqual(reducePlayback(initialPlaybackState, "toggle", count), initialPlaybackState);
    assert.deepEqual(reducePlayback(initialPlaybackState, "next", count), initialPlaybackState);
  }
});
