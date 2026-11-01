import { algorithms, type AlgorithmId, type AlgorithmParams } from "../algorithms";
import type { UpdateParam } from "../algorithms/parameters";
import type { SpeedMode } from "../playback/speed";
import { ParameterPanel } from "./ParameterPanel";
import { SpeedPanel } from "./SpeedPanel";

type AlgorithmSidebarProps = {
  algorithmId: AlgorithmId;
  onSelect: (id: AlgorithmId) => void;
  input: string;
  onInputChange: (input: string) => void;
  onApplyInput: () => void;
  params: AlgorithmParams;
  updateParam: UpdateParam;
  speedMode: SpeedMode;
  onSpeedChange: (speed: SpeedMode) => void;
};

export function AlgorithmSidebar({ algorithmId, onSelect, input, onInputChange, onApplyInput, params, updateParam, speedMode, onSpeedChange }: AlgorithmSidebarProps) {
  return (
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
            type="button"
            className={`algo-card ${item.id === algorithmId ? "active" : ""}`}
            aria-pressed={item.id === algorithmId}
            onClick={() => onSelect(item.id)}
          >{item.label}</button>
        ))}
      </section>
      <form className="panel" onSubmit={(event) => { event.preventDefault(); onApplyInput(); }}>
        <h2>初始链表</h2>
        <label className="input-label" htmlFor="list-input">输入数字，使用空格或逗号分隔</label>
        <div className="input-row">
          <input id="list-input" value={input} onChange={(event) => onInputChange(event.target.value)} placeholder="1 2 3 4 5" />
          <button type="submit">应用</button>
        </div>
      </form>
      <ParameterPanel algorithmId={algorithmId} params={params} updateParam={updateParam} />
      <SpeedPanel algorithmId={algorithmId} speedMode={speedMode} setSpeedMode={onSpeedChange} />
    </aside>
  );
}
