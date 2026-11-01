import { FLOAT_ROW_Y, type AlgorithmDefinition, type AlgorithmStep, type ArrowVisual, type NodePosition } from './types';
import { createNodes, makeArrows, rowPositions, step, targetX, valueOf } from './layout';
import { integerParam } from './parameters';

const code = [
  'ListNode* reverseKGroup(ListNode* head, int k) {',
  '    ListNode dummy(0, head);',
  '    ListNode* prevGroup = &dummy;',
  '    while (true) {',
  '        ListNode* groupEnd = prevGroup;',
  '        for (int i = 0; i < k && groupEnd; ++i) groupEnd = groupEnd->next;',
  '        if (groupEnd == nullptr) break;',
  '        ListNode* groupStart = prevGroup->next;',
  '        ListNode* nextGroup = groupEnd->next;',
  '        // reverse [groupStart, groupEnd]',
  '        prevGroup->next = groupEnd;',
  '        groupStart->next = nextGroup;',
  '        prevGroup = groupStart;',
  '    }',
  '    return dummy.next;',
  '}',
];

export const reverseKGroup: AlgorithmDefinition = {
  id: 'reverseKGroup',
  label: 'K 个一组反转',
  title: 'K 个一组反转',
  fileName: 'reverse-k-group.cpp',
  code,
  makeSteps(values, params) {
    const nodes = createNodes(values);
    let order = nodes.map((node) => node.id);
    const steps: AlgorithmStep[] = [];
    const k = integerParam(params.k, 3, 1);
    let start = 0;
    let prevGroup: string | null = null;

    const push = (
      title: string,
      phase: string,
      lines: number[],
      explanation: string,
      currentOrder: string[],
      pointers: Record<string, string | null | undefined>,
      active: string[] = [],
      arrows: ArrowVisual[] = makeArrows(currentOrder),
      extra: Partial<Omit<AlgorithmStep, 'positions'>> & { overrides?: Record<string, Partial<NodePosition>> } = {},
    ) => {
      steps.push(
        step(
          nodes,
          title,
          phase,
          rowPositions(nodes, currentOrder, undefined, {
            active,
            lifted: extra.liftedNodeId,
            overrides: extra.overrides,
          }),
          arrows,
          {
            dummy: currentOrder[0] ?? null,
            head: currentOrder[0] ?? null,
            prevGroup,
            ...pointers,
          },
          lines,
          explanation,
          active,
          {
            rowLabels: { bottom: '链表主线 / 当前分组' },
            ...extra,
          },
        ),
      );
    };

    push(
      '初始化 dummy / prevGroup',
      'init',
      [1, 2, 3],
      `每轮先检查后面是否够 ${k} 个节点；不够就保持原样，够才反转这一组。`,
      order,
      { prevGroup },
    );

    while (start < order.length) {
      const group = order.slice(start, start + k);
      const remaining = order.slice(start);

      push(
        '检查这一组是否够 k 个节点',
        'check-k',
        [4, 5, 6],
        `从当前位置开始数节点，准备确认是否还有完整的 k=${k} 个节点。`,
        order,
        { prevGroup, groupStart: group[0] ?? null, groupEnd: group[group.length - 1] ?? null },
        remaining,
      );

      if (group.length < k) {
        push(
          '剩余不足 k 个，保持原样',
          'not-enough',
          [6, 7],
          `剩余只有 ${group.length} 个节点，不足 k=${k}，这一段不反转，直接保持原来的顺序。`,
          order,
          { prevGroup, groupStart: group[0] ?? null, groupEnd: null, nextGroup: null },
          group,
          makeArrows(order, 'muted'),
        );
        break;
      }

      const groupStart = group[0];
      const groupEnd = group[group.length - 1];
      const nextGroup = order[start + k] ?? null;

      push(
        '找到完整一组',
        'mark-boundary',
        [7, 8, 9],
        `这一组从 groupStart=${valueOf(nodes, groupStart)} 到 groupEnd=${valueOf(nodes, groupEnd)}，nextGroup=${valueOf(nodes, nextGroup)}。先停一下看清边界。`,
        order,
        { prevGroup, groupStart, groupEnd, nextGroup },
        [groupStart, groupEnd, nextGroup].filter(Boolean) as string[],
      );

      push(
        '准备断开组边界',
        'pause-before-cut',
        [9, 10],
        '在真正反转前，先观察这一组与后续链表的连接位置；下一步会临时断开并重连箭头。',
        order,
        { prevGroup, groupStart, groupEnd, nextGroup },
        group,
      );

      push(
        '断开 groupEnd -> nextGroup',
        'break-boundary',
        [9, 10],
        nextGroup
          ? 'groupEnd 指向 nextGroup 的箭头变成虚线，表示这一组要临时脱离出来处理。'
          : '这一组已经到达链表尾部，groupEnd 原本指向 nullptr。',
        order,
        { prevGroup, groupStart, groupEnd, nextGroup },
        [groupEnd, nextGroup].filter(Boolean) as string[],
        makeArrows(order).map((arrow) =>
          arrow.from === groupEnd ? { ...arrow, state: 'breaking' as const } : arrow,
        ),
      );

      let workingOrder = order;
      const reversedGroup = group.slice().reverse();

      reversedGroup.forEach((id, offset) => {
        const fromIndex = workingOrder.indexOf(id);
        const targetIndex = start + offset;
        const withoutNode = workingOrder.filter((nodeId) => nodeId !== id);
        const nextOrder = [
          ...withoutNode.slice(0, targetIndex),
          id,
          ...withoutNode.slice(targetIndex),
        ];

        push(
          `拿起节点 ${valueOf(nodes, id)}`,
          'lift-node',
          [10],
          `先拿起节点 ${valueOf(nodes, id)}，它会被放到当前组反转后的第 ${offset + 1} 个位置。`,
          workingOrder,
          { prevGroup, groupStart, groupEnd, nextGroup, cur: id },
          [id],
          makeArrows(workingOrder),
          {
            liftedNodeId: id,
            movingNodeId: id,
            overrides: {
              [id]: { x: targetX(fromIndex), y: FLOAT_ROW_Y, lifted: true },
            },
          },
        );

        push(
          `断开节点 ${valueOf(nodes, id)} 的局部箭头`,
          'break-node-arrow',
          [10],
          '这一拍只处理箭头：相关连接变成虚线，让学生看到“先摘出来，再放进去”的过程。',
          workingOrder,
          { prevGroup, groupStart, groupEnd, nextGroup, cur: id },
          [id],
          makeArrows(workingOrder).map((arrow) =>
            arrow.from === id || arrow.to === id ? { ...arrow, state: 'breaking' as const } : arrow,
          ),
          {
            liftedNodeId: id,
            movingNodeId: id,
            overrides: {
              [id]: { x: targetX(fromIndex), y: FLOAT_ROW_Y, lifted: true },
            },
          },
        );

        push(
          `移动节点 ${valueOf(nodes, id)} 到组内新位置`,
          'move-node',
          [10],
          `节点 ${valueOf(nodes, id)} 横向移动到反转后的位置，先悬停在链表上方。`,
          nextOrder,
          { prevGroup, groupStart, groupEnd, nextGroup, cur: id },
          [id],
          makeArrows(nextOrder, 'new'),
          {
            liftedNodeId: id,
            movingNodeId: id,
            overrides: {
              [id]: { x: targetX(targetIndex), y: FLOAT_ROW_Y, lifted: true },
            },
          },
        );

        push(
          `放下节点 ${valueOf(nodes, id)} 并接上箭头`,
          'drop-node',
          [10],
          `节点 ${valueOf(nodes, id)} 落回链表，新箭头短暂停留为绿色，表示局部顺序已经更新。`,
          nextOrder,
          { prevGroup, groupStart, groupEnd, nextGroup, cur: id },
          [id],
          makeArrows(nextOrder, 'new'),
        );

        workingOrder = nextOrder;
      });

      order = workingOrder;

      push(
        '接回前后链表',
        'connect-group',
        [11, 12],
        'prevGroup->next 接到新的组头，groupStart->next 接到 nextGroup；这一组重新接回主链。',
        order,
        { prevGroup, groupStart, groupEnd, nextGroup },
        group,
        makeArrows(order, 'new'),
      );

      push(
        '展示本组反转结果',
        'group-result',
        [11, 12],
        `这一组已经反转完成：${group.map((id) => valueOf(nodes, id)).join(' -> ')} 变成 ${group
          .slice()
          .reverse()
          .map((id) => valueOf(nodes, id))
          .join(' -> ')}。先停一下看当前链表。`,
        order,
        { prevGroup, groupStart, groupEnd, nextGroup },
        reversedGroup,
      );

      prevGroup = groupStart;
      start += k;

      push(
        'prevGroup 移到本组尾部',
        'move-prev-group',
        [13],
        'prevGroup 移动到反转后的组尾，也就是原来的 groupStart，准备检查下一组。',
        order,
        { prevGroup },
        [prevGroup],
      );
    }

    push(
      '返回结果',
      'done',
      [15],
      '所有完整 k 组处理完毕，返回 dummy.next。',
      order,
      { prevGroup },
    );

    return steps;
  },
};
