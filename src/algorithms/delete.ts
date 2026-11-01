import { TOP_ROW_Y, type AlgorithmDefinition, type AlgorithmStep } from './types';
import { createNodes, makeArrows, rowPositions, step, targetX, valueOf } from './layout';
import { integerParam } from './parameters';

const code = [
  'ListNode* deleteAt(ListNode* head, int index) {',
  '    ListNode dummy(0, head);',
  '    ListNode* prev = &dummy;',
  '    for (int i = 0; i < index && prev->next; ++i) {',
  '        prev = prev->next;',
  '    }',
  '    ListNode* del = prev->next;',
  '    if (del != nullptr) {',
  '        prev->next = del->next;',
  '        delete del;',
  '    }',
  '    return dummy.next;',
  '}',
];

export const deleteNode: AlgorithmDefinition = {
  id: 'delete',
  label: '删除节点 delete',
  title: '删除节点',
  fileName: 'delete-node.cpp',
  code,
  makeSteps(values, params) {
    const nodes = createNodes(values);
    const ids = nodes.map((node) => node.id);
    const index = integerParam(params.deleteIndex, 0, 0, ids.length);
    const del = ids[index] ?? null;
    const prev = index === 0 ? null : ids[index - 1];
    const next = ids[index + 1] ?? null;
    const after = ids.filter((id) => id !== del);
    const steps: AlgorithmStep[] = [];

    steps.push(step(nodes, '初始化 dummy', 'init', rowPositions(nodes, ids), makeArrows(ids), { dummy: ids[0] ?? null, head: ids[0] ?? null, prev: null }, [1, 2, 3], '使用 dummy，让删除头节点和删除中间节点走同一套逻辑。', [], { rowLabels: { bottom: '原链表' } }));

    if (!del) {
      steps.push(step(nodes, '没有可删除的节点', 'done', rowPositions(nodes, ids), makeArrows(ids), { head: ids[0] ?? null }, [8, 12], '位置超出链表范围，del 为 nullptr，保留原链表。'));
      return steps;
    }

    for (let i = 0; i < index; i += 1) {
      const p = ids[i];
      steps.push(step(nodes, `prev 向后走：i = ${i}`, 'walk-prev', rowPositions(nodes, ids, undefined, { active: [p] }), makeArrows(ids), { dummy: ids[0] ?? null, head: ids[0] ?? null, prev: p }, [4, 5], `prev 向后移动，停到待删除节点的前一个位置。`, [p], { rowLabels: { bottom: '原链表' } }));
    }

    steps.push(step(nodes, '定位 del', 'locate-del', rowPositions(nodes, ids, undefined, { active: [del ?? ''].filter(Boolean) }), makeArrows(ids), { dummy: ids[0] ?? null, head: ids[0] ?? null, prev, del }, [7, 8], `del 指向要删除的节点 ${valueOf(nodes, del)}。`, del ? [del] : [], { rowLabels: { bottom: '原链表' } }));
    steps.push(step(nodes, '绕过 del', 'bypass', rowPositions(nodes, ids, undefined, { active: [prev ?? '', del ?? '', next ?? ''].filter(Boolean) }), [...makeArrows(ids).filter((arrow) => arrow.from !== prev && arrow.from !== del), ...(prev && next ? [{ from: prev, to: next, state: 'new' as const }] : next ? [{ from: ids[0], to: next, state: 'new' as const }] : [])], { dummy: after[0] ?? null, head: after[0] ?? null, prev, del }, [9], prev ? 'prev->next 直接指向 del->next，逻辑上绕过 del。' : '删除头节点时，dummy.next 直接指向第二个节点。', [prev ?? '', del ?? '', next ?? ''].filter(Boolean), { rowLabels: { bottom: '重连中' } }));
    steps.push(step(nodes, 'del 移出链表', 'fade-del', rowPositions(nodes, ids, undefined, { active: [del ?? ''].filter(Boolean), lifted: del, faded: [del ?? ''], overrides: del ? { [del]: { x: targetX(index), y: TOP_ROW_Y - 72, lifted: true, faded: true } } : {} }), makeArrows(after, 'new'), { dummy: after[0] ?? null, head: after[0] ?? null, prev, del }, [10], 'del 节点淡出并移走，表示释放节点。', del ? [del] : [], { liftedNodeId: del, movingNodeId: del, rowLabels: { bottom: '删除后链表' } }));
    const remainingNodes = nodes.filter((node) => node.id !== del);
    steps.push(step(remainingNodes, '删除完成', 'done', rowPositions(remainingNodes, after), makeArrows(after), { dummy: after[0] ?? null, head: after[0] ?? null }, [12], '剩余节点重新排成连续链表，删除完成。', [], { rowLabels: { bottom: '删除后链表' } }));
    return steps;
  },
};
