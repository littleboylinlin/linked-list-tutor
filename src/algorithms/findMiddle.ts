import { type AlgorithmDefinition, type AlgorithmStep } from './types';
import { createNodes, makeArrows, rowPositions, step, valueOf } from './layout';

const code = [
  'ListNode* middleNode(ListNode* head) {',
  '    ListNode* slow = head;',
  '    ListNode* fast = head;',
  '    while (fast != nullptr && fast->next != nullptr) {',
  '        slow = slow->next;',
  '        fast = fast->next->next;',
  '    }',
  '    return slow;',
  '}',
];

export const findMiddle: AlgorithmDefinition = {
  id: 'findMiddle',
  label: '快慢指针 find middle',
  title: '快慢指针找中点',
  fileName: 'find-middle.cpp',
  code,
  makeSteps(values) {
    const nodes = createNodes(values);
    const ids = nodes.map((node) => node.id);
    const steps: AlgorithmStep[] = [];
    let slow = 0;
    let fast = 0;
    const push = (title: string, phase: string, lines: number[], text: string, active: string[] = []) => {
      steps.push(step(nodes, title, phase, rowPositions(nodes, ids, undefined, { active }), makeArrows(ids), { head: ids[0] ?? null, slow: ids[slow] ?? null, fast: ids[fast] ?? null }, lines, text, active, { rowLabels: { bottom: '链表主线' } }));
    };

    push('初始化 slow / fast', 'init', [1, 2, 3], 'slow 和 fast 都从 head 出发；fast 每次走两步，slow 每次走一步。', [ids[0]].filter(Boolean));
    while (fast < ids.length && fast + 1 < ids.length) {
      const oldFast = fast;
      fast += 1;
      push('fast 先走第一步', 'fast-one', [4, 6], `fast 从 ${valueOf(nodes, ids[oldFast])} 走到 ${valueOf(nodes, ids[fast])}，检查还可以继续走。`, [ids[fast]]);
      fast += 1;
      push('fast 再走第二步', 'fast-two', [6], fast < ids.length ? `fast 再走一步到 ${valueOf(nodes, ids[fast])}。` : 'fast 再走一步到 nullptr。', ids[fast] ? [ids[fast]] : []);
      slow += 1;
      push('slow 走一步', 'slow-one', [5], `slow 走一步到 ${valueOf(nodes, ids[slow])}。fast 比 slow 快一倍，所以 slow 最终停在中点。`, [ids[slow]]);
    }

    push('找到中点', 'done', [8], !ids.length ? '链表为空，返回 nullptr。' : ids.length % 2 === 0 ? `偶数长度时返回第二个中点：${valueOf(nodes, ids[slow])}。` : `奇数长度时 slow 正好停在中点：${valueOf(nodes, ids[slow])}。`, ids[slow] ? [ids[slow]] : []);
    return steps;
  },
};
