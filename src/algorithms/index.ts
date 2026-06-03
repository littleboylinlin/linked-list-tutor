import { deleteNode } from './delete';
import { detectCycle } from './detectCycle';
import { findMiddle } from './findMiddle';
import { insert } from './insert';
import { removeNth } from './removeNth';
import { reverse } from './reverse';
import { reverseKGroup } from './reverseKGroup';
import { swapPairs } from './swapPairs';

export const algorithms = [reverse, insert, deleteNode, findMiddle, swapPairs, reverseKGroup, detectCycle, removeNth];

export type { AlgorithmId, AlgorithmParams } from './types';
