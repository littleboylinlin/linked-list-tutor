import assert from "node:assert/strict";
import test from "node:test";
import { parseListInput } from "../src/algorithms/layout";
import { integerParam } from "../src/algorithms/parameters";
import { getPlaybackDelay } from "../src/playback/speed";

test("list inputs accept both comma styles and stay inside the teaching size limit", () => {
  assert.deepEqual(parseListInput(" 1,2，3 invalid Infinity "), [1, 2, 3]);
  assert.deepEqual(parseListInput(""), [1, 2, 3, 4, 5]);
  assert.equal(parseListInput("1 2 3 4 5 6 7 8 9 10").length, 9);
});

test("integer parameters cannot produce fractional indices or NaN coordinates", () => {
  assert.equal(integerParam(2.9, 3, 1), 2);
  assert.equal(integerParam(Number.NaN, 3, 1), 3);
  assert.equal(integerParam(Infinity, 3, 1), 3);
  assert.equal(integerParam(-2, 3, 1), 1);
  assert.equal(integerParam(50, 3, 1, 9), 9);
});

test("normal K-group playback retains its slower teaching pace", () => {
  assert.ok(getPlaybackDelay("normal", "reverseKGroup") > getPlaybackDelay("normal", "reverse"));
  assert.ok(getPlaybackDelay("slow", "reverse") > getPlaybackDelay("normal", "reverse"));
  assert.ok(getPlaybackDelay("normal", "reverse") > getPlaybackDelay("fast", "reverse"));
});
