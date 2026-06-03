import { FLOAT_ROW_Y, type AlgorithmDefinition, type AlgorithmStep } from './types';
import { createNodes, makeArrows, rowPositions, step, targetX, valueOf } from './layout';

const code = [
  'ListNode* swapPairs(ListNode* head) {',
  '    ListNode dummy(0, head);',
  '    ListNode* prev = &dummy;',
  '    while (prev->next && prev->next->next) {',
  '        ListNode* first = prev->next;',
  '        ListNode* second = first->next;',
  '        ListNode* nxt = second->next;',
  '        prev->next = second;',
  '        first->next = nxt;',
  '        second->next = first;',
  '        prev = first;',
  '    }',
  '    return dummy.next;',
  '}',
];

export const swapPairs: AlgorithmDefinition = {
  id: 'swapPairs',
  label: '两两交换 swap pairs',
  title: '两两交换节点',
  fileName: 'swap-pairs.cpp',
  code,
  makeSteps(values) {
    const nodes = createNodes(values);
    let order = nodes.map((node) => node.id);
    const steps: AlgorithmStep[] = [];
    let i = 0;
    let prev: string | null = null;

    steps.push(step(nodes, '初始化 dummy / prev', 'init', rowPositions(nodes, order), makeArrows(order), { dummy: order[0] ?? null, head: order[0] ?? null, prev }, [1, 2, 3], 'dummy 站在链表前面，prev 指向每一组交换前的前驱。', [], { rowLabels: { bottom: '链表主线' } }));

    while (i + 1 < order.length) {
      const first = order[i];
      const second = order[i + 1];
      const nxt = order[i + 2] ?? null;
      const swapped = [...order.slice(0, i), second, first, ...order.slice(i + 2)];

      steps.push(step(nodes, `选中一对：${valueOf(nodes, first)} / ${valueOf(nodes, second)}`, 'pick-pair', rowPositions(nodes, order, undefined, { active: [first, second] }), makeArrows(order), { dummy: order[0] ?? null, head: order[0] ?? null, prev, first, second, nxt }, [4, 5, 6, 7], 'first 和 second 是本轮要交换的两个节点，nxt 保存下一组的起点。', [first, second], { rowLabels: { bottom: '交换前' } }));
      steps.push(step(nodes, '拿起 second', 'lift-second', rowPositions(nodes, order, undefined, { active: [first, second], lifted: second, overrides: { [second]: { x: targetX(i + 1), y: FLOAT_ROW_Y, lifted: true } } }), makeArrows(order), { dummy: order[0] ?? null, head: order[0] ?? null, prev, first, second, nxt }, [8], 'second 上浮，准备移动到 first 前面。', [first, second], { liftedNodeId: second, movingNodeId: second, rowLabels: { bottom: '交换中' } }));
      steps.push(step(nodes, 'second 移到 first 前面', 'move-second', rowPositions(nodes, swapped, undefined, { active: [first, second], lifted: second, overrides: { [second]: { x: targetX(i), y: FLOAT_ROW_Y, lifted: true } } }), makeArrows(swapped, 'new'), { dummy: swapped[0] ?? null, head: swapped[0] ?? null, prev, first, second, nxt }, [8, 9, 10], 'prev->next 指向 second，first->next 指向 nxt，second->next 指向 first。', [first, second], { liftedNodeId: second, movingNodeId: second, rowLabels: { bottom: '重连中' } }));
      steps.push(step(nodes, '放下 second 并完成重连', 'drop-second', rowPositions(nodes, swapped, undefined, { active: [first, second] }), makeArrows(swapped, 'new'), { dummy: swapped[0] ?? null, head: swapped[0] ?? null, prev, first, second, nxt }, [10], 'second 落下，这一对节点交换完成。', [first, second], { rowLabels: { bottom: '交换后' } }));
      prev = first;
      order = swapped;
      i += 2;
      steps.push(step(nodes, 'prev 移动到 first', 'move-prev', rowPositions(nodes, order, undefined, { active: [prev] }), makeArrows(order), { dummy: order[0] ?? null, head: order[0] ?? null, prev }, [11], 'prev 移动到交换后的第二个节点 first，准备处理下一组。', [prev], { rowLabels: { bottom: '链表主线' } }));
    }

    steps.push(step(nodes, '交换完成', 'done', rowPositions(nodes, order), makeArrows(order), { dummy: order[0] ?? null, head: order[0] ?? null, prev }, [13], '剩余不足两个节点时保持原样，返回 dummy.next。', [], { rowLabels: { bottom: '最终链表' } }));
    return steps;
  },
};
