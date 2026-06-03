import { TOP_ROW_Y, type AlgorithmDefinition, type AlgorithmStep } from './types';
import { createNodes, makeArrows, rowPositions, step, targetX, valueOf } from './layout';

const code = [
  'ListNode* removeNthFromEnd(ListNode* head, int n) {',
  '    ListNode dummy(0, head);',
  '    ListNode* fast = &dummy;',
  '    ListNode* slow = &dummy;',
  '    for (int i = 0; i <= n; ++i) {',
  '        fast = fast->next;',
  '    }',
  '    while (fast != nullptr) {',
  '        fast = fast->next;',
  '        slow = slow->next;',
  '    }',
  '    ListNode* del = slow->next;',
  '    slow->next = del->next;',
  '    delete del;',
  '    return dummy.next;',
  '}',
];

export const removeNth: AlgorithmDefinition = {
  id: 'removeNth',
  label: '删除倒数第 N 个',
  title: '删除倒数第 N 个节点',
  fileName: 'remove-nth-from-end.cpp',
  code,
  makeSteps(values, params) {
    const nodes = createNodes(values);
    const ids = nodes.map((node) => node.id);
    const n = Math.max(1, Math.min(params.n, ids.length));
    const steps: AlgorithmStep[] = [];
    let fast = -1;
    let slow = -1;
    const ptr = (index: number) => (index >= 0 && index < ids.length ? ids[index] : index === -1 ? null : null);

    steps.push(step(nodes, '初始化 dummy / fast / slow', 'init', rowPositions(nodes, ids), makeArrows(ids), { dummy: ids[0] ?? null, head: ids[0] ?? null, fast: null, slow: null }, [1, 2, 3, 4], 'fast 和 slow 都从 dummy 出发。fast 先走 n+1 步，是为了让 slow 停在待删除节点的前一个位置。', [], { rowLabels: { bottom: '原链表' } }));

    for (let i = 0; i <= n; i += 1) {
      fast += 1;
      steps.push(step(nodes, `fast 先走：第 ${i + 1} 步`, 'fast-gap', rowPositions(nodes, ids, undefined, { active: ptr(fast) ? [ptr(fast)!] : [] }), makeArrows(ids), { dummy: ids[0] ?? null, head: ids[0] ?? null, fast: ptr(fast), slow: ptr(slow) }, [5, 6], fast < ids.length ? `fast 先走到 ${valueOf(nodes, ptr(fast))}，逐步拉开 n+1 的距离。` : 'fast 走到 nullptr，距离已经拉开。', ptr(fast) ? [ptr(fast)!] : [], { rowLabels: { bottom: '拉开距离' } }));
    }

    while (fast < ids.length) {
      fast += 1;
      slow += 1;
      steps.push(step(nodes, 'fast 和 slow 同步前进', 'walk-together', rowPositions(nodes, ids, undefined, { active: [ptr(fast), ptr(slow)].filter(Boolean) as string[] }), makeArrows(ids), { dummy: ids[0] ?? null, head: ids[0] ?? null, fast: ptr(fast), slow: ptr(slow) }, [8, 9, 10], 'fast 和 slow 一起走；fast 到尾后，slow 正好在待删除节点前一个位置。', [ptr(fast), ptr(slow)].filter(Boolean) as string[], { rowLabels: { bottom: '同步前进' } }));
    }

    const delIndex = slow + 1;
    const del = ids[delIndex] ?? null;
    const next = ids[delIndex + 1] ?? null;
    const after = ids.filter((id) => id !== del);
    steps.push(step(nodes, '定位待删除节点', 'locate-del', rowPositions(nodes, ids, undefined, { active: [ptr(slow), del].filter(Boolean) as string[] }), makeArrows(ids), { dummy: ids[0] ?? null, head: ids[0] ?? null, slow: ptr(slow), del }, [12], `slow->next 就是倒数第 ${n} 个节点：${valueOf(nodes, del)}。`, [ptr(slow), del].filter(Boolean) as string[], { rowLabels: { bottom: '定位删除点' } }));
    steps.push(step(nodes, 'slow->next 绕过 del', 'bypass', rowPositions(nodes, ids, undefined, { active: [ptr(slow), del, next].filter(Boolean) as string[] }), [...makeArrows(ids).filter((arrow) => arrow.from !== ptr(slow) && arrow.from !== del), ...(ptr(slow) && next ? [{ from: ptr(slow)!, to: next, state: 'new' as const }] : [])], { dummy: after[0] ?? null, head: after[0] ?? null, slow: ptr(slow), del }, [13], 'slow->next 指向 del->next，逻辑上把 del 从链表中摘掉。', [ptr(slow), del, next].filter(Boolean) as string[], { rowLabels: { bottom: '重连中' } }));
    steps.push(step(nodes, '删除 del', 'remove-del', rowPositions(nodes, ids, undefined, { active: del ? [del] : [], lifted: del, faded: del ? [del] : [], overrides: del ? { [del]: { x: targetX(delIndex), y: TOP_ROW_Y - 72, lifted: true, faded: true } } : {} }), makeArrows(after, 'new'), { dummy: after[0] ?? null, head: after[0] ?? null, slow: ptr(slow), del }, [14], 'del 淡出移走，表示释放这个节点。', del ? [del] : [], { liftedNodeId: del, movingNodeId: del, rowLabels: { bottom: '删除后链表' } }));
    steps.push(step(nodes, '返回结果', 'done', rowPositions(nodes, after), makeArrows(after), { dummy: after[0] ?? null, head: after[0] ?? null }, [15], '返回 dummy.next，删除倒数第 N 个节点完成。', [], { rowLabels: { bottom: '最终链表' } }));
    return steps;
  },
};
