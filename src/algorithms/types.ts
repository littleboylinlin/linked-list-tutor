export type AlgorithmId =
  | 'reverse'
  | 'insert'
  | 'delete'
  | 'findMiddle'
  | 'swapPairs'
  | 'reverseKGroup'
  | 'detectCycle'
  | 'removeNth';

export type NodeSnapshot = {
  id: string;
  value: number;
  ghost?: boolean;
};

export type NodePosition = {
  x: number;
  y: number;
  lifted?: boolean;
  active?: boolean;
  faded?: boolean;
};

export type ArrowState = 'normal' | 'breaking' | 'new' | 'cycle' | 'muted';

export type ArrowVisual = {
  from: string;
  to: string;
  state?: ArrowState;
  label?: string;
};

export type AlgorithmStep = {
  title: string;
  phase: string;
  nodes: NodeSnapshot[];
  positions: Record<string, NodePosition>;
  arrows: ArrowVisual[];
  pointers: Record<string, string | null | undefined>;
  activeNodeIds: string[];
  movingNodeId?: string | null;
  liftedNodeId?: string | null;
  activeLines: number[];
  explanation: string;
  rowLabels?: { top?: string; bottom?: string };
};

export type AlgorithmParams = {
  insertIndex: number;
  insertValue: number;
  deleteIndex: number;
  k: number;
  cycleEnabled: boolean;
  cycleEntryIndex: number;
  n: number;
};

export type AlgorithmDefinition = {
  id: AlgorithmId;
  label: string;
  title: string;
  fileName: string;
  code: string[];
  makeSteps: (values: number[], params: AlgorithmParams) => AlgorithmStep[];
};

export const NODE_WIDTH = 92;
export const NODE_HEIGHT = 74;
export const NODE_GAP = 78;
export const LEFT_PAD = 92;
export const TOP_ROW_Y = 118;
export const FLOAT_ROW_Y = 218;
export const BOTTOM_ROW_Y = 318;

// Red / blue / black family only. prev · cur · nxt = 霓虹赤 · 电光蓝 · 黑.
export const pointerColors: Record<string, string> = {
  prev: '#f5011a',
  cur: '#0247fe',
  nxt: '#0b0b0c',
  head: '#48484e',
  dummy: '#83838a',
  newNode: '#0247fe',
  del: '#0b0b0c',
  slow: '#0247fe',
  fast: '#f5011a',
  first: '#0247fe',
  second: '#0b0b0c',
  groupStart: '#0247fe',
  groupEnd: '#0b0b0c',
  prevGroup: '#f5011a',
  nextGroup: '#48484e',
};
