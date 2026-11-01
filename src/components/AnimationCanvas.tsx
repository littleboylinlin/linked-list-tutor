import type { CSSProperties } from 'react';
import {
  NODE_HEIGHT,
  NODE_WIDTH,
  pointerColors,
  type AlgorithmStep,
  type ArrowVisual,
  type NodePosition,
  type NodeSnapshot,
} from '../algorithms/types';
import { contentWidth } from '../algorithms/layout';

type AnimationCanvasProps = {
  step: AlgorithmStep;
  /** Changes on every step so the active node can replay its bounce. */
  stepIndex: number;
};

export function AnimationCanvas({ step, stepIndex }: AnimationCanvasProps) {
  const stageWidth = Math.max(contentWidth(step.nodes.length + 2), maxPositionX(step.positions) + 220);

  return (
    <div className="canvas-card">
      <div className="canvas-scroll">
        <div className="animation-stage" style={{ width: stageWidth }}>
          <div className="section-label reversed-label">{step.rowLabels?.top ?? '工作区 / 已处理部分'}</div>
          <div className="section-label pending-label">{step.rowLabels?.bottom ?? '链表主线 / 待处理部分'}</div>
          <div className="row-divider" />
          <ArrowLayer step={step} />
          <PointerLayer step={step} />
          {step.nodes.map((node) => (
            <NodeView
              key={node.id}
              node={node}
              position={step.positions[node.id]}
              active={step.activeNodeIds.includes(node.id)}
              lifted={step.liftedNodeId === node.id}
              stepIndex={stepIndex}
            />
          ))}
        </div>
      </div>
      <NullStrip pointers={step.pointers} />
    </div>
  );
}

function maxPositionX(positions: Record<string, NodePosition>) {
  return Object.values(positions).reduce((max, position) => Math.max(max, position.x), 0);
}

function NodeView({
  node,
  position,
  active,
  lifted,
  stepIndex,
}: {
  node: NodeSnapshot;
  position: NodePosition | undefined;
  active: boolean;
  lifted: boolean;
  stepIndex: number;
}) {
  const safePosition = position ?? { x: 92, y: 318 };
  const isLifted = lifted || safePosition.lifted;
  const scale = isLifted ? 1.08 : 1;
  const y = isLifted ? safePosition.y - 8 : safePosition.y;
  const isActive = active || Boolean(safePosition.active);

  return (
    <div
      className={`node-card ${isActive ? 'active-node' : ''} ${isLifted ? 'lifted-node' : ''} ${
        safePosition.faded || node.ghost ? 'faded-node' : ''
      }`}
      style={{
        transform: `translate(${safePosition.x}px, ${y}px) scale(${scale})`,
      }}
    >
      {/* The outer box only moves; the body carries the look and remounts each step while active, replaying the bounce. */}
      <div className="node-body" key={isActive ? `active-${stepIndex}` : 'idle'}>
        <span className="node-value">{node.value}</span>
        <span className="next-field" title="next">
          <i />
        </span>
      </div>
    </div>
  );
}

function ArrowLayer({ step }: { step: AlgorithmStep }) {
  return (
    <svg className="arrow-layer" width="100%" height="100%" aria-hidden="true">
      <defs>
        <marker id="arrow-head" markerWidth="13" markerHeight="13" refX="11" refY="6.5" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M 0 0.5 L 12 6.5 L 0 12.5 z" />
        </marker>
      </defs>
      {step.arrows.map((arrow, index) => (
        <ArrowPath key={`${arrow.from}-${arrow.to}-${arrow.state ?? 'normal'}-${index}`} arrow={arrow} step={step} />
      ))}
    </svg>
  );
}

function ArrowPath({ arrow, step }: { arrow: ArrowVisual; step: AlgorithmStep }) {
  const from = step.positions[arrow.from];
  const to = step.positions[arrow.to];
  if (!from || !to) return null;

  const x1 = from.x + NODE_WIDTH - 14; // starts from the dot inside the next field
  const y1 = from.y + NODE_HEIGHT / 2;
  const x2 = to.x - 1;
  const y2 = to.y + NODE_HEIGHT / 2;
  const reverse = x2 < x1;
  const mid = Math.max(34, Math.abs(x2 - x1) / 2);
  const lift = arrow.state === 'cycle' || reverse ? 76 : 0;
  const path =
    lift > 0
      ? `M ${x1} ${y1} C ${x1 + mid} ${y1 - lift}, ${x2 - mid} ${y2 - lift}, ${x2} ${y2}`
      : `M ${x1} ${y1} C ${x1 + mid} ${y1}, ${x2 - mid} ${y2}, ${x2} ${y2}`;

  return <path className={`link-path ${arrow.state ?? 'normal'}`} d={path} />;
}

function PointerLayer({ step }: { step: AlgorithmStep }) {
  const grouped = new Map<string, string[]>();

  Object.entries(step.pointers).forEach(([name, target]) => {
    if (!target) return;
    grouped.set(target, [...(grouped.get(target) ?? []), name]);
  });

  return (
    <div className="pointer-layer" aria-hidden="true">
      {[...grouped.entries()].map(([nodeId, names]) => {
        const position = step.positions[nodeId];
        if (!position) return null;

        return names.map((name, index) => (
          <span
            key={`${name}-${nodeId}`}
            className={`pointer-badge ${index > 0 ? 'stacked' : ''}`}
            style={
              {
                '--pointer-color': pointerColors[name] ?? 'var(--ink-2)',
                transform: `translate(${position.x + NODE_WIDTH / 2 - 27}px, ${position.y - 42 - index * 28}px)`,
              } as CSSProperties
            }
          >
            {name}
          </span>
        ));
      })}
    </div>
  );
}

function NullStrip({ pointers }: { pointers: Record<string, string | null | undefined> }) {
  const nullPointers = Object.entries(pointers)
    .filter(([, target]) => target === null)
    .map(([name]) => name);

  return (
    <div className="null-strip">
      <span className="nullptr-chip">nullptr</span>
      <div className="null-pointer-list">
        {nullPointers.length === 0 ? (
          <p>指向空的指针会停在这里，画布里只显示指向节点的标签。</p>
        ) : (
          nullPointers.map((name) => (
            <span
              key={name}
              className="pointer-badge static-badge"
              style={{ '--pointer-color': pointerColors[name] ?? 'var(--ink-2)' } as CSSProperties}
            >
              {name}
            </span>
          ))
        )}
      </div>
    </div>
  );
}
