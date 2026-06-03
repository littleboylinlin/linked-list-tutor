import { BOTTOM_ROW_Y, FLOAT_ROW_Y, type AlgorithmDefinition, type AlgorithmStep } from './types';
import { createNodes, makeArrows, step, targetX, twoRowPositions, valueOf } from './layout';

export const reverseCode = [
  'ListNode* reverseList(ListNode* head) {',
  '    ListNode* prev = nullptr;',
  '    ListNode* cur = head;',
  '    while (cur != nullptr) {',
  '        ListNode* nxt = cur->next;',
  '        cur->next = prev;',
  '        prev = cur;',
  '        cur = nxt;',
  '    }',
  '    return prev;',
  '}',
];

export const reverse: AlgorithmDefinition = {
  id: 'reverse',
  label: '反转链表 reverse',
  title: '反转链表',
  fileName: 'reverse-list.cpp',
  code: reverseCode,
  makeSteps(values) {
    const nodes = createNodes(values);
    const steps: AlgorithmStep[] = [];
    const first = nodes[0]?.id ?? null;
    let reversed: string[] = [];
    let pending = nodes.map((node) => node.id);
    let prev: string | null = null;
    let cur: string | null = first;

    const push = (
      title: string,
      phase: string,
      activeLines: number[],
      explanation: string,
      options: {
        top?: string[];
        bottom?: string[];
        arrows?: ReturnType<typeof makeArrows>;
        pointers?: Record<string, string | null | undefined>;
        active?: string[];
        lifted?: string | null;
        override?: Record<string, { x?: number; y?: number; lifted?: boolean }>;
      } = {},
    ) => {
      const top = options.top ?? reversed;
      const bottom = options.bottom ?? pending;
      steps.push(
        step(
          nodes,
          title,
          phase,
          twoRowPositions(nodes, top, bottom, {
            active: options.active,
            lifted: options.lifted,
            overrides: options.override,
          }),
          options.arrows ?? [...makeArrows(top), ...makeArrows(bottom)],
          { head: first, prev, cur, ...options.pointers },
          activeLines,
          explanation,
          options.active ?? [],
          {
            liftedNodeId: options.lifted,
            movingNodeId: options.lifted,
            rowLabels: { top: '已反转部分', bottom: '待处理部分' },
          },
        ),
      );
    };

    push('初始化', 'init', [1], '函数接收 head，下方是待处理链表，上方会逐步形成反转后的链表。');
    push('prev 指向 nullptr', 'init-prev', [2], 'prev 表示已经反转好的部分。开始时还没有节点，所以 prev 是 nullptr。', {
      pointers: { prev: null },
    });
    push('cur 从 head 开始', 'init-cur', [3], 'cur 指向当前要处理的节点，从 head 开始。');

    while (cur) {
      const curId = cur;
      const nxt = pending[1] ?? null;
      const shifted = [curId, ...reversed];
      const rest = pending.slice(1);
      const broken = [...makeArrows(reversed), ...makeArrows(rest), ...(nxt ? [{ from: curId, to: nxt, state: 'breaking' as const }] : [])];
      const connected = [...makeArrows(shifted, 'new'), ...makeArrows(rest)];

      push(`高亮 cur：节点 ${valueOf(nodes, curId)}`, 'highlight-cur', [4], `cur 指向值为 ${valueOf(nodes, curId)} 的节点，这一轮会把它拿起来。`, {
        active: [curId],
      });
      push('保存 nxt', 'save-nxt', [5], nxt ? `nxt 记住 cur 原来的下一个节点 ${valueOf(nodes, nxt)}。` : 'cur 是最后一个待处理节点，nxt 保存为 nullptr。', {
        pointers: { nxt },
        active: [curId],
      });
      push('拿起 cur', 'lift-cur', [5], 'cur 节点上浮，准备改写它的 next 指针。', {
        pointers: { nxt },
        active: [curId],
        lifted: curId,
        override: { [curId]: { x: targetX(0), y: BOTTOM_ROW_Y - 46, lifted: true } },
      });
      push('断开原 next', 'break-next', [5, 6], nxt ? 'cur 指向原后继的箭头变成虚线并淡出。' : 'cur 原本指向 nullptr，保持可改写状态。', {
        pointers: { nxt },
        arrows: broken,
        active: [curId],
        lifted: curId,
        override: { [curId]: { x: targetX(0), y: BOTTOM_ROW_Y - 46, lifted: true } },
      });
      push('移动到已反转部分最前面', 'move-front', [6], prev ? `cur->next 改为 prev，移动到 ${valueOf(nodes, prev)} 前面。` : 'cur->next 改为 nullptr，移动到已反转部分起点。', {
        top: shifted,
        bottom: rest,
        pointers: { nxt },
        arrows: connected,
        active: [curId],
        lifted: curId,
        override: { [curId]: { x: targetX(0), y: FLOAT_ROW_Y, lifted: true } },
      });
      push('放下 cur 并接上新箭头', 'drop-cur', [6], prev ? 'cur 落下，新箭头从 cur 指向 prev。' : 'cur 落下，成为已反转部分的第一个节点。', {
        top: shifted,
        bottom: rest,
        pointers: { nxt },
        arrows: connected,
        active: [curId],
      });

      prev = curId;
      push('prev 移动到 cur', 'move-prev', [7], '当前节点已经接到反转链表前面，所以 prev 前进到 cur。', {
        top: shifted,
        bottom: rest,
        pointers: { prev, cur: curId, nxt },
        active: [curId],
      });

      cur = nxt;
      push('cur 移动到 nxt', 'move-cur', [8], cur ? `cur 前进到 nxt，也就是节点 ${valueOf(nodes, cur)}。` : 'cur 前进到 nullptr，下一次检查会结束循环。', {
        top: shifted,
        bottom: rest,
        pointers: { prev, cur, nxt },
        active: cur ? [cur] : [],
      });

      reversed = shifted;
      pending = rest;
    }

    push('循环结束', 'done-loop', [9], 'cur 已经到达 nullptr，所有节点都完成了反转。', {
      pointers: { prev, cur: null, nxt: null },
      active: prev ? [prev] : [],
    });
    push('返回新头节点', 'return', [10], 'prev 指向反转后的头节点，返回 prev。', {
      pointers: { head: prev, prev, cur: null, nxt: null },
      active: prev ? [prev] : [],
    });

    return steps;
  },
};
