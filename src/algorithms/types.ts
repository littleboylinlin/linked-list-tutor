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

export const pointerColors: Record<string, string> = {
  head: '#7c3aed',
  dummy: '#9333ea',
  prev: '#0f766e',
  cur: '#2563eb',
  nxt: '#ea580c',
  newNode: '#db2777',
  del: '#dc2626',
  slow: '#16a34a',
  fast: '#f59e0b',
  first: '#0284c7',
  second: '#c026d3',
  groupStart: '#0891b2',
  groupEnd: '#be123c',
  prevGroup: '#0f766e',
  nextGroup: '#ea580c',
};
