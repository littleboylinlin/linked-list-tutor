import assert from "node:assert/strict";
import test from "node:test";
import { algorithms } from "../src/algorithms";
import { defaultParams } from "../src/algorithms/parameters";
import type { AlgorithmId, AlgorithmParams, AlgorithmStep } from "../src/algorithms/types";
import { codeSnippets, mapActiveLines } from "../src/codeSnippets";

function timeline(id: AlgorithmId, values: number[], overrides: Partial<AlgorithmParams> = {}) {
  return algorithms.find((algorithm) => algorithm.id === id)!.makeSteps(values, { ...defaultParams, ...overrides });
}

function valuesFromHead(step: AlgorithmStep) {
  const result: number[] = [], seen = new Set<string>();
  let id = step.pointers.head;
  while (id) {
    assert.ok(!seen.has(id), "final list must not cycle");
    seen.add(id);
    const node = step.nodes.find((node) => node.id === id);
    assert.ok(node, "head and arrows must refer to existing nodes");
    result.push(node.value);
    id = step.arrows.find((arrow) => arrow.from === id)?.to;
  }
  assert.equal(seen.size, step.nodes.length, "deleted nodes must not reappear in the final frame");
  return result;
}

test("every algorithm produces valid nodes, pointers, geometry, and code mappings", () => {
  for (const algorithm of algorithms) {
    for (const values of [[], [42], [1, 2], [1, 2, 3, 4, 5], [1, 1, 1]]) {
      const input = [...values];
      const steps = timeline(algorithm.id, input);
      assert.deepEqual(input, values, "generators must not mutate the input list");
      assert.ok(steps.length);
      for (const step of steps) {
        const ids = new Set(step.nodes.map((node) => node.id));
        for (const position of Object.values(step.positions)) {
          assert.ok(Number.isFinite(position.x) && Number.isFinite(position.y), algorithm.id);
        }
        for (const target of [...Object.values(step.pointers), ...step.activeNodeIds]) {
          if (target != null) assert.ok(ids.has(target), algorithm.id + ": unknown pointer " + target);
        }
        for (const arrow of step.arrows) assert.ok(ids.has(arrow.from) && ids.has(arrow.to), algorithm.id);
        for (const language of ["cpp", "c", "python"] as const) {
          for (const line of mapActiveLines(algorithm.id, language, step.activeLines)) {
            assert.ok(line > 0 && line <= codeSnippets[algorithm.id][language].lines.length, algorithm.id + ": invalid code mapping");
          }
        }
      }
    }
  }
});

test("reverse and pair swapping preserve the expected node order", () => {
  for (let length = 0; length <= 9; length++) {
    const values = Array.from({ length }, (_, index) => index + 10);
    assert.deepEqual(valuesFromHead(timeline("reverse", values).at(-1)!), values.toReversed());
    const expected = [...values];
    for (let i = 0; i + 1 < length; i += 2) [expected[i], expected[i + 1]] = [expected[i + 1], expected[i]];
    assert.deepEqual(valuesFromHead(timeline("swapPairs", values).at(-1)!), expected);
  }
});

test("K-group reversal preserves short tails, including k larger than the whole list", () => {
  for (let length = 0; length <= 9; length++) {
    const values = Array.from({ length }, (_, index) => index + 1);
    for (let k = 1; k <= 12; k++) {
      const expected = values.map((_, index) => {
        const start = Math.floor(index / k) * k;
        return start + k <= length ? values[start + k - 1 - (index - start)] : values[index];
      });
      assert.deepEqual(valuesFromHead(timeline("reverseKGroup", values, { k }).at(-1)!), expected, "length=" + length + ", k=" + k);
    }
  }
});

test("insert and delete handle head, middle, tail, and out-of-range positions", () => {
  for (const values of [[], [1], [1, 2, 3, 4]]) {
    for (let index = 0; index <= values.length + 2; index++) {
      const inserted = [...values];
      inserted.splice(Math.min(index, values.length), 0, 99);
      assert.deepEqual(valuesFromHead(timeline("insert", values, { insertIndex: index }).at(-1)!), inserted);
      const deleted = values.filter((_, i) => i !== index);
      assert.deepEqual(valuesFromHead(timeline("delete", values, { deleteIndex: index }).at(-1)!), deleted);
    }
  }
});

test("removeNth removes exactly the requested node and its final visual", () => {
  for (let length = 1; length <= 9; length++) {
    const values = Array.from({ length }, (_, index) => index + 1);
    for (let n = 1; n <= length; n++) {
      assert.deepEqual(valuesFromHead(timeline("removeNth", values, { n }).at(-1)!), values.filter((_, i) => i !== length - n));
    }
  }
});

test("fast/slow pointers return the second middle for even-sized lists", () => {
  for (let length = 0; length <= 9; length++) {
    const values = Array.from({ length }, (_, index) => index + 1);
    const final = timeline("findMiddle", values).at(-1)!;
    assert.equal(final.pointers.slow, length ? "n" + Math.floor(length / 2) : null);
  }
});

test("cycle detection respects singleton inputs and every supported entry point", () => {
  for (let length = 0; length <= 9; length++) {
    const values = Array.from({ length }, (_, index) => index + 1);
    for (const cycleEnabled of [false, true]) {
      for (let cycleEntryIndex = 0; cycleEntryIndex < Math.max(1, length); cycleEntryIndex++) {
        const steps = timeline("detectCycle", values, { cycleEnabled, cycleEntryIndex });
        assert.equal(steps[0].nodes.length, length, "the supplied list must not be replaced");
        assert.equal(steps.at(-1)!.phase, cycleEnabled && length > 0 ? "meet" : "no-cycle");
      }
    }
  }
});
