import { useEffect, useMemo, useState } from 'react';
import { algorithms, type AlgorithmId, type AlgorithmParams } from './algorithms';
import { parseListInput } from './algorithms/layout';
import { AnimationCanvas } from './components/AnimationCanvas';
import { CodePanel } from './components/CodePanel';
import { StepController } from './components/StepController';
import type { CodeLanguage } from './codeSnippets';

type SpeedMode = 'slow' | 'normal' | 'fast';

const defaultParams: AlgorithmParams = {
  insertIndex: 2,
  insertValue: 99,
  deleteIndex: 2,
  k: 3,
  cycleEnabled: true,
  cycleEntryIndex: 1,
  n: 2,
};

function App() {
  const [algorithmId, setAlgorithmId] = useState<AlgorithmId>('reverse');
  const [input, setInput] = useState('1 2 3 4 5');
  const [appliedValues, setAppliedValues] = useState([1, 2, 3, 4, 5]);
  const [params, setParams] = useState(defaultParams);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMode, setSpeedMode] = useState<SpeedMode>('normal');
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>('cpp');

  const algorithm = algorithms.find((item) => item.id === algorithmId) ?? algorithms[0];
  const steps = useMemo(() => algorithm.makeSteps(appliedValues, params), [algorithm, appliedValues, params]);
  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const playbackDelay = getPlaybackDelay(speedMode, algorithmId);

  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
  }, [algorithmId, appliedValues, params]);

  useEffect(() => {
    if (!isPlaying) return undefined;
    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setStepIndex((current) => Math.min(current + 1, steps.length - 1));
    }, playbackDelay);

    return () => window.clearTimeout(timer);
  }, [isPlaying, playbackDelay, stepIndex, steps.length]);

  const applyInput = () => {
    setAppliedValues(parseListInput(input));
  };

  const updateParam = (name: keyof AlgorithmParams, value: number | boolean) => {
    setParams((current) => ({ ...current, [name]: value }));
  };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <span className="eyebrow">C++ Linked List Tutor</span>
          <h1>单链表交互教学</h1>
          <p>选择算法，观察节点、箭头和指针标签如何一步步变化。</p>
        </div>

        <section className="panel">
          <h2>算法列表</h2>
          {algorithms.map((item) => (
            <button
              key={item.id}
              className={`algo-card ${item.id === algorithmId ? 'active' : ''}`}
              onClick={() => setAlgorithmId(item.id)}
            >
              {item.label}
            </button>
          ))}
        </section>

        <section className="panel">
          <h2>初始链表</h2>
          <label className="input-label" htmlFor="list-input">
            输入数字，使用空格或逗号分隔
          </label>
          <div className="input-row">
            <input
              id="list-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="1 2 3 4 5"
            />
            <button onClick={applyInput}>应用</button>
          </div>
        </section>

        <ParameterPanel algorithmId={algorithmId} params={params} updateParam={updateParam} />
        <SpeedPanel speedMode={speedMode} setSpeedMode={setSpeedMode} algorithmId={algorithmId} />
      </aside>

      <section className="visual-area">
        <div className="visual-header">
          <div>
            <span className="eyebrow">Phase {stepIndex + 1} / {steps.length}</span>
            <h2>{algorithm.title}</h2>
          </div>
          <div className="progress-track" aria-label="phase progress">
            <div style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} />
          </div>
        </div>

        <div className="phase-chip-row">
          <span>{step.phase}</span>
          <strong>{step.title}</strong>
        </div>

        <AnimationCanvas step={step} />
      </section>

      <CodePanel
        algorithmId={algorithm.id}
        language={codeLanguage}
        activeLines={step.activeLines}
        onLanguageChange={setCodeLanguage}
      />

      <StepController
        explanation={step.explanation}
        canPrev={stepIndex > 0}
        canNext={stepIndex < steps.length - 1}
        isPlaying={isPlaying}
        onPrev={() => {
          setIsPlaying(false);
          setStepIndex((current) => Math.max(current - 1, 0));
        }}
        onNext={() => {
          setIsPlaying(false);
          setStepIndex((current) => Math.min(current + 1, steps.length - 1));
        }}
        onTogglePlay={() => setIsPlaying((current) => !current)}
        onReset={() => {
          setIsPlaying(false);
          setStepIndex(0);
        }}
      />
    </main>
  );
}

function getPlaybackDelay(speedMode: SpeedMode, algorithmId: AlgorithmId) {
  const baseDelay: Record<SpeedMode, number> = {
    slow: 1400,
    normal: algorithmId === 'reverseKGroup' ? 1200 : 880,
    fast: 560,
  };

  return baseDelay[speedMode];
}

function SpeedPanel({
  speedMode,
  setSpeedMode,
  algorithmId,
}: {
  speedMode: SpeedMode;
  setSpeedMode: (value: SpeedMode) => void;
  algorithmId: AlgorithmId;
}) {
  return (
    <section className="panel speed-panel">
      <h2>播放速度</h2>
      <div className="segmented-control">
        {(['slow', 'normal', 'fast'] as SpeedMode[]).map((mode) => (
          <button
            key={mode}
            className={speedMode === mode ? 'active' : ''}
            onClick={() => setSpeedMode(mode)}
          >
            {mode === 'slow' ? '慢速' : mode === 'normal' ? '正常' : '快速'}
          </button>
        ))}
      </div>
      {algorithmId === 'reverseKGroup' && speedMode === 'normal' && (
        <p className="parameter-hint">K 个一组反转在正常速度下会自动放慢，方便看清断箭头和接箭头。</p>
      )}
    </section>
  );
}

function ParameterPanel({
  algorithmId,
  params,
  updateParam,
}: {
  algorithmId: AlgorithmId;
  params: AlgorithmParams;
  updateParam: (name: keyof AlgorithmParams, value: number | boolean) => void;
}) {
  return (
    <section className="panel parameter-panel">
      <h2>算法参数</h2>
      {algorithmId === 'insert' && (
        <>
          <NumberInput label="插入位置 index" value={params.insertIndex} min={0} onChange={(value) => updateParam('insertIndex', value)} />
          <NumberInput label="插入值 value" value={params.insertValue} onChange={(value) => updateParam('insertValue', value)} />
        </>
      )}
      {algorithmId === 'delete' && (
        <NumberInput label="删除位置 index" value={params.deleteIndex} min={0} onChange={(value) => updateParam('deleteIndex', value)} />
      )}
      {algorithmId === 'reverseKGroup' && (
        <NumberInput label="每组数量 k" value={params.k} min={2} onChange={(value) => updateParam('k', value)} />
      )}
      {algorithmId === 'detectCycle' && (
        <>
          <label className="toggle-row">
            <input
              type="checkbox"
              checked={params.cycleEnabled}
              onChange={(event) => updateParam('cycleEnabled', event.target.checked)}
            />
            创建环
          </label>
          <NumberInput label="环入口位置" value={params.cycleEntryIndex} min={0} onChange={(value) => updateParam('cycleEntryIndex', value)} />
        </>
      )}
      {algorithmId === 'removeNth' && (
        <NumberInput label="倒数第 n 个" value={params.n} min={1} onChange={(value) => updateParam('n', value)} />
      )}
      {['reverse', 'findMiddle', 'swapPairs'].includes(algorithmId) && (
        <p className="parameter-hint">这个算法不需要额外参数，直接使用当前链表。</p>
      )}
    </section>
  );
}

function NumberInput({
  label,
  value,
  min,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="param-field">
      <span>{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export default App;
