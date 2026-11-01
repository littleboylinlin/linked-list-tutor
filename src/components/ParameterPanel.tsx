import type { AlgorithmId, AlgorithmParams } from "../algorithms";
import type { UpdateParam } from "../algorithms/parameters";

type ParameterPanelProps = {
  algorithmId: AlgorithmId;
  params: AlgorithmParams;
  updateParam: UpdateParam;
};

export function ParameterPanel({ algorithmId, params, updateParam }: ParameterPanelProps) {
  const noParams = ["reverse", "findMiddle", "swapPairs"].includes(algorithmId);

  return (
    <section className="side-section">
      <h2 className="section-title"><span>PARAMS</span>算法参数</h2>
      {noParams ? (
        <p className="hint">这个算法不需要额外参数，直接使用当前链表。</p>
      ) : (
        <div className="param-grid">
          {algorithmId === "insert" && (
            <>
              <NumberInput label="插入位置" sub="index" value={params.insertIndex} min={0} onChange={(value) => updateParam("insertIndex", value)} />
              <NumberInput label="插入值" sub="value" value={params.insertValue} onChange={(value) => updateParam("insertValue", value)} />
            </>
          )}
          {algorithmId === "delete" && (
            <NumberInput label="删除位置" sub="index" value={params.deleteIndex} min={0} onChange={(value) => updateParam("deleteIndex", value)} />
          )}
          {algorithmId === "reverseKGroup" && (
            <NumberInput label="每组数量" sub="k" value={params.k} min={1} onChange={(value) => updateParam("k", value)} />
          )}
          {algorithmId === "detectCycle" && (
            <>
              <label className="switch-row">
                <span>创建环</span>
                <input
                  type="checkbox"
                  role="switch"
                  className="switch"
                  checked={params.cycleEnabled}
                  onChange={(event) => updateParam("cycleEnabled", event.target.checked)}
                />
              </label>
              <NumberInput label="环入口位置" sub="index" value={params.cycleEntryIndex} min={0} onChange={(value) => updateParam("cycleEntryIndex", value)} />
            </>
          )}
          {algorithmId === "removeNth" && (
            <NumberInput label="倒数第 n 个" sub="n" value={params.n} min={1} onChange={(value) => updateParam("n", value)} />
          )}
        </div>
      )}
    </section>
  );
}

function NumberInput({ label, sub, value, min, onChange }: {
  label: string;
  sub?: string;
  value: number;
  min?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="field">
      <span className="field-label">{label}{sub && <code>{sub}</code>}</span>
      <input type="number" value={value} min={min} step={1} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}
