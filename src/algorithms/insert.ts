import { FLOAT_ROW_Y, TOP_ROW_Y, type AlgorithmDefinition, type AlgorithmStep, type NodeSnapshot } from './types';
import { createNodes, makeArrows, rowPositions, step, targetX, valueOf } from './layout';

const code = [
  'ListNode* insertAt(ListNode* head, int index, int value) {',
  '    ListNode dummy(0, head);',
  '    ListNode* prev = &dummy;',
  '    for (int i = 0; i < index && prev->next; ++i) {',
  '        prev = prev->next;',
  '    }',
  '    ListNode* cur = prev->next;',
  '    ListNode* newNode = new ListNode(value);',
  '    newNode->next = cur;',
  '    prev->next = newNode;',
  '    return dummy.next;',
  '}',
];

export const insert: AlgorithmDefinition = {
  id: 'insert',
  label: '插入节点 insert',
  title: '插入节点',
  fileName: 'insert-node.cpp',
  code,
  makeSteps(values, params) {
    const base = createNodes(values);
    const newNode: NodeSnapshot = { id: 'newNode', value: params.insertValue };
    const nodes = [newNode, ...base];
    const ids = base.map((node) => node.id);
    const index = Math.max(0, Math.min(params.insertIndex, ids.length));
    const prev = index === 0 ? null : ids[index - 1];
    const cur = ids[index] ?? null;
    const inserted = [...ids.slice(0, index), newNode.id, ...ids.slice(index)];
    const steps: AlgorithmStep[] = [];
    const hiddenNew = { [newNode.id]: { x: targetX(index), y: TOP_ROW_Y - 88, lifted: true } };

    steps.push(step(nodes, '初始化 dummy', 'init', rowPositions(nodes, ids, undefined, { overrides: hiddenNew }), makeArrows(ids), { dummy: ids[0] ?? null, head: ids[0] ?? null }, [1, 2], '使用 dummy 统一处理头插和普通插入，newNode 先在上方等待。', [], { rowLabels: { bottom: '原链表' } }));

    for (let i = 0; i < index; i += 1) {
      const p = i === 0 ? ids[0] : ids[i];
      steps.push(step(nodes, `prev 向后走：i = ${i}`, 'walk-prev', rowPositions(nodes, ids, undefined, { active: [p], overrides: hiddenNew }), makeArrows(ids), { dummy: ids[0] ?? null, head: ids[0] ?? null, prev: p }, [4, 5], `prev 向后移动，寻找插入位置 index=${index} 的前一个节点。`, [p], { rowLabels: { bottom: '原链表' } }));
    }

    steps.push(step(nodes, '定位 prev 和 cur', 'locate', rowPositions(nodes, ids, undefined, { active: [prev ?? ids[0], cur ?? ''].filter(Boolean), overrides: hiddenNew }), makeArrows(ids), { dummy: ids[0] ?? null, head: ids[0] ?? null, prev, cur }, [7], `prev 停在插入位置前一个节点，cur 是原来 index=${index} 位置的节点。`, [prev ?? '', cur ?? ''].filter(Boolean), { rowLabels: { bottom: '原链表' } }));

    steps.push(step(nodes, 'newNode 从上方出现', 'spawn-new', rowPositions(nodes, ids, undefined, { active: [newNode.id], lifted: newNode.id, overrides: { [newNode.id]: { x: targetX(index), y: FLOAT_ROW_Y - 90, lifted: true } } }), makeArrows(ids), { dummy: ids[0] ?? null, head: ids[0] ?? null, prev, cur, newNode: newNode.id }, [8], `创建值为 ${params.insertValue} 的 newNode，它从上方出现。`, [newNode.id], { liftedNodeId: newNode.id, movingNodeId: newNode.id, rowLabels: { bottom: '插入前链表' } }));

    steps.push(step(nodes, 'newNode->next 指向 cur', 'new-next', rowPositions(nodes, inserted, undefined, { active: [newNode.id, cur ?? ''].filter(Boolean), lifted: newNode.id, overrides: { [newNode.id]: { x: targetX(index), y: FLOAT_ROW_Y, lifted: true } } }), [...makeArrows(ids), ...(cur ? [{ from: newNode.id, to: cur, state: 'new' as const }] : [])], { dummy: ids[0] ?? newNode.id, head: ids[0] ?? newNode.id, prev, cur, newNode: newNode.id }, [9], cur ? `先让 newNode->next 指向 cur，也就是节点 ${valueOf(nodes, cur)}。` : '插入到尾部时，newNode->next 指向 nullptr。', [newNode.id, cur ?? ''].filter(Boolean), { liftedNodeId: newNode.id, movingNodeId: newNode.id, rowLabels: { bottom: '准备重连' } }));

    steps.push(step(nodes, 'prev->next 指向 newNode', 'prev-next', rowPositions(nodes, inserted, undefined, { active: [prev ?? newNode.id, newNode.id].filter(Boolean) }), makeArrows(inserted, 'new'), { dummy: inserted[0] ?? null, head: inserted[0] ?? null, prev, cur, newNode: newNode.id }, [10], prev ? '再让 prev->next 指向 newNode，完成插入重连。' : '头插时 dummy.next 指向 newNode，newNode 成为新的头节点。', [prev ?? newNode.id, newNode.id].filter(Boolean), { rowLabels: { bottom: '插入后链表' } }));

    steps.push(step(nodes, '插入完成', 'done', rowPositions(nodes, inserted, undefined, { active: [newNode.id] }), makeArrows(inserted), { dummy: inserted[0] ?? null, head: inserted[0] ?? null }, [11], 'newNode 落入链表，所有箭头恢复为稳定状态。', [newNode.id], { rowLabels: { bottom: '插入后链表' } }));
    return steps;
  },
};
