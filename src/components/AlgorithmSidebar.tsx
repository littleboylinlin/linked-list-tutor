import { algorithms, type AlgorithmId, type AlgorithmParams } from "../algorithms";
import type { UpdateParam } from "../algorithms/parameters";
import type { SpeedMode } from "../playback/speed";
import { ArrowRightIcon, BrandMark } from "./icons";
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
  /** Mobile only: whether the collapsible menu is expanded. Ignored on desktop. */
  open?: boolean;
};

export const englishNames: Record<AlgorithmId, string> = {
  reverse: "Reverse List",
  insert: "Insert Node",
  delete: "Delete Node",
  findMiddle: "Middle Node",
  swapPairs: "Swap Pairs",
  reverseKGroup: "Reverse K-Group",
  detectCycle: "Linked List Cycle",
  removeNth: "Remove Nth From End",
};

/** "反转链表 reverse" → "反转链表"; labels without a latin suffix are kept as-is. */
export function chineseName(label: string) {
  return label.replace(/\s+[a-zA-Z][a-zA-Z ]*$/, "");
}

export function AlgorithmSidebar({ algorithmId, onSelect, input, onInputChange, onApplyInput, params, updateParam, speedMode, onSpeedChange, open = false }: AlgorithmSidebarProps) {
  return (
    <aside id="algorithm-menu" className={`sidebar ${open ? "open" : ""}`}>
      <div className="brand">
        <BrandMark />
        <div>
          <h1>单链表<br />交互教学</h1>
          <p>LINKED LIST TUTOR · C++</p>
        </div>
      </div>

      <nav className="side-section" aria-label="算法列表">
        <h2 className="section-title"><span>ALGORITHMS</span>算法</h2>
        <div className="algo-list">
          {algorithms.map((item, index) => {
            const active = item.id === algorithmId;
            return (
              <button
                key={item.id}
                type="button"
                className={`algo-item ${active ? "active" : ""}`}
                aria-pressed={active}
                onClick={() => onSelect(item.id)}
              >
                <span className="algo-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="algo-text">
                  <strong>{chineseName(item.label)}</strong>
                  <small>{englishNames[item.id]}</small>
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <form className="side-section" onSubmit={(event) => { event.preventDefault(); onApplyInput(); }}>
        <h2 className="section-title"><span>INPUT</span>初始链表</h2>
        <div className="input-row">
          <input
            id="list-input"
            aria-label="初始链表"
            value={input}
            onChange={(event) => onInputChange(event.target.value)}
            placeholder="1 2 3 4 5"
            spellCheck={false}
          />
          <button type="submit" aria-label="应用链表" title="应用"><ArrowRightIcon size={16} /></button>
        </div>
        <p className="hint">数字之间用空格或逗号分隔，最多 9 个节点。</p>
      </form>

      <ParameterPanel algorithmId={algorithmId} params={params} updateParam={updateParam} />
      <SpeedPanel algorithmId={algorithmId} speedMode={speedMode} setSpeedMode={onSpeedChange} />
    </aside>
  );
}
