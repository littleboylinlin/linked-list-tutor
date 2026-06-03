import {
  BOTTOM_ROW_Y,
  FLOAT_ROW_Y,
  LEFT_PAD,
  NODE_GAP,
  NODE_WIDTH,
  TOP_ROW_Y,
  type AlgorithmStep,
  type ArrowState,
  type ArrowVisual,
  type NodePosition,
  type NodeSnapshot,
} from './types';

export function parseListInput(input: string) {
  const values = input
    .trim()
    .split(/[\s,，]+/)
    .filter(Boolean)
    .map(Number)
    .filter((value) => Number.isFinite(value));

  return values.length > 0 ? values.slice(0, 9) : [1, 2, 3, 4, 5];
}

export function createNodes(values: number[], prefix = 'n'): NodeSnapshot[] {
  return values.map((value, index) => ({
    id: `${prefix}${index}`,
    value,
  }));
}

export function targetX(index: number) {
  return LEFT_PAD + index * (NODE_WIDTH + NODE_GAP);
}

export function rowPositions(
  nodes: NodeSnapshot[],
  order: string[],
  y = BOTTOM_ROW_Y,
  options: {
    active?: string[];
    lifted?: string | null;
    faded?: string[];
    overrides?: Record<string, Partial<NodePosition>>;
  } = {},
) {
  const positions: Record<string, NodePosition> = {};
  const active = new Set(options.active ?? []);
  const faded = new Set(options.faded ?? []);

  order.forEach((id, index) => {
    positions[id] = {
      x: targetX(index),
      y,
      active: active.has(id),
      lifted: options.lifted === id,
      faded: faded.has(id),
      ...options.overrides?.[id],
    };
  });

  nodes.forEach((node) => {
    const fallback = {
      x: targetX(order.indexOf(node.id) >= 0 ? order.indexOf(node.id) : 0),
      y,
      active: active.has(node.id),
      lifted: options.lifted === node.id,
      faded: faded.has(node.id),
    };
    positions[node.id] = {
      ...fallback,
      ...positions[node.id],
      ...options.overrides?.[node.id],
    };
  });

  return positions;
}

export function twoRowPositions(
  nodes: NodeSnapshot[],
  topOrder: string[],
  bottomOrder: string[],
  options: {
    active?: string[];
    lifted?: string | null;
    faded?: string[];
    overrides?: Record<string, Partial<NodePosition>>;
  } = {},
) {
  const positions = rowPositions(nodes, bottomOrder, BOTTOM_ROW_Y, options);
  const active = new Set(options.active ?? []);
  const faded = new Set(options.faded ?? []);

  topOrder.forEach((id, index) => {
    positions[id] = {
      x: targetX(index),
      y: TOP_ROW_Y,
      active: active.has(id),
      lifted: options.lifted === id,
      faded: faded.has(id),
      ...options.overrides?.[id],
    };
  });

  return positions;
}

export function circlePositions(
  nodes: NodeSnapshot[],
  order: string[],
  active: string[] = [],
  lifted?: string | null,
) {
  const positions: Record<string, NodePosition> = {};
  const activeSet = new Set(active);
  const centerX = LEFT_PAD + Math.max(3, order.length) * 78;
  const centerY = FLOAT_ROW_Y;
  const radiusX = Math.max(210, order.length * 44);
  const radiusY = 116;

  order.forEach((id, index) => {
    const angle = -Math.PI / 2 + (index / order.length) * Math.PI * 2;
    positions[id] = {
      x: centerX + Math.cos(angle) * radiusX,
      y: centerY + Math.sin(angle) * radiusY,
      active: activeSet.has(id),
      lifted: lifted === id,
    };
  });

  nodes.forEach((node) => {
    positions[node.id] ??= {
      x: targetX(0),
      y: BOTTOM_ROW_Y,
      active: activeSet.has(node.id),
      lifted: lifted === node.id,
    };
  });

  return positions;
}

export function makeArrows(order: string[], state: ArrowState = 'normal'): ArrowVisual[] {
  return order.slice(0, -1).map((from, index) => ({
    from,
    to: order[index + 1],
    state,
  }));
}

export function valueOf(nodes: NodeSnapshot[], id: string | null | undefined) {
  if (!id) return 'nullptr';
  return nodes.find((node) => node.id === id)?.value ?? id;
}

export function contentWidth(nodeCount: number) {
  return LEFT_PAD * 2 + Math.max(1, nodeCount) * NODE_WIDTH + Math.max(0, nodeCount - 1) * NODE_GAP;
}

export function step(
  nodes: NodeSnapshot[],
  title: string,
  phase: string,
  positions: Record<string, NodePosition>,
  arrows: ArrowVisual[],
  pointers: Record<string, string | null | undefined>,
  activeLines: number[],
  explanation: string,
  activeNodeIds: string[] = [],
  extra: Partial<AlgorithmStep> = {},
): AlgorithmStep {
  return {
    title,
    phase,
    nodes,
    positions,
    arrows,
    pointers,
    activeLines,
    explanation,
    activeNodeIds,
    ...extra,
  };
}
