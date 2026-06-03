import { type AlgorithmDefinition, type AlgorithmStep } from './types';
import { circlePositions, createNodes, makeArrows, rowPositions, step, valueOf } from './layout';

const code = [
  'bool hasCycle(ListNode* head) {',
  '    ListNode* slow = head;',
  '    ListNode* fast = head;',
  '    while (fast != nullptr && fast->next != nullptr) {',
  '        slow = slow->next;',
  '        fast = fast->next->next;',
  '        if (slow == fast) return true;',
  '    }',
  '    return false;',
  '}',
];

export const detectCycle: AlgorithmDefinition = {
  id: 'detectCycle',
  label: '环形链表检测',
  title: '环形链表检测',
  fileName: 'detect-cycle.cpp',
  code,
  makeSteps(values, params) {
    const nodes = createNodes(values.length > 1 ? values : [1, 2, 3, 4]);
    const ids = nodes.map((node) => node.id);
    const entryIndex = Math.max(0, Math.min(params.cycleEntryIndex, ids.length - 1));
    const entry = ids[entryIndex] ?? null;
    const hasCycle = params.cycleEnabled;
    const baseArrows = hasCycle ? [...makeArrows(ids), { from: ids[ids.length - 1], to: entry, state: 'cycle' as const }] : makeArrows(ids);
    const positions = hasCycle ? circlePositions(nodes, ids) : rowPositions(nodes, ids);
    const steps: AlgorithmStep[] = [];
    let slow = 0;
    let fast = 0;
    const maxRounds = hasCycle ? ids.length + 2 : Math.ceil(ids.length / 2) + 1;

    const push = (title: string, phase: string, lines: number[], text: string, active: string[] = []) => {
      steps.push(step(nodes, title, phase, positionsFor(active), baseArrows, { head: ids[0] ?? null, slow: ids[slow] ?? null, fast: ids[fast] ?? null }, lines, text, active, { rowLabels: { bottom: hasCycle ? '环形布局' : '线性链表' } }));
    };
    const positionsFor = (active: string[]) => (hasCycle ? circlePositions(nodes, ids, active) : rowPositions(nodes, ids, undefined, { active }));

    push('初始化 slow / fast', 'init', [1, 2, 3], hasCycle ? `创建环：尾节点指回入口 ${valueOf(nodes, entry)}。` : '没有创建环，尾节点指向 nullptr。', [ids[0]].filter(Boolean));

    for (let round = 0; round < maxRounds; round += 1) {
      if (!hasCycle && (fast >= ids.length || fast + 1 >= ids.length)) {
        push('fast 到达 nullptr', 'no-cycle', [4, 9], 'fast 或 fast->next 已经到达 nullptr，说明不存在环。', ids[slow] ? [ids[slow]] : []);
        break;
      }

      slow = nextIndex(slow, ids.length, hasCycle, entryIndex);
      push('slow 走一步', 'slow-step', [5], `slow 移动到 ${valueOf(nodes, ids[slow])}。`, [ids[slow]]);
      fast = nextIndex(nextIndex(fast, ids.length, hasCycle, entryIndex), ids.length, hasCycle, entryIndex);
      push('fast 走两步', 'fast-step', [6], ids[fast] ? `fast 连续走两步到 ${valueOf(nodes, ids[fast])}。` : 'fast 走到 nullptr。', ids[fast] ? [ids[fast]] : []);

      if (hasCycle && slow === fast) {
        push('slow 与 fast 相遇', 'meet', [7], `slow 和 fast 在节点 ${valueOf(nodes, ids[slow])} 相遇，因此存在环。`, [ids[slow]]);
        break;
      }
    }

    return steps;
  },
};

function nextIndex(index: number, length: number, hasCycle: boolean, entryIndex: number) {
  const next = index + 1;
  if (next < length) return next;
  return hasCycle ? entryIndex : length;
}
