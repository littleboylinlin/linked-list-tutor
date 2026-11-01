import type { AlgorithmId, AlgorithmParams } from "../algorithms";
import type { UpdateParam } from "../algorithms/parameters";

type ParameterPanelProps = {
  algorithmId: AlgorithmId;
  params: AlgorithmParams;
  updateParam: UpdateParam;
};

export function ParameterPanel({ algorithmId, params, updateParam }: ParameterPanelProps) {
  return (
    <section className="panel parameter-panel">
      <h2>算法参数</h2>
      {algorithmId === "insert" && (
        <>
          <NumberInput label="插入位置 index" value={params.insertIndex} min={0} onChange={(value) => updateParam("insertIndex", value)} />
          <NumberInput label="插入值 value" value={params.insertValue} onChange={(value) => updateParam("insertValue", value)} />
        </>
      )}
      {algorithmId === "delete" && (
        <NumberInput label="删除位置 index" value={params.deleteIndex} min={0} onChange={(value) => updateParam("deleteIndex", value)} />
      )}
      {algorithmId === "reverseKGroup" && (
        <NumberInput label="每组数量 k" value={params.k} min={1} onChange={(value) => updateParam("k", value)} />
      )}
      {algorithmId === "detectCycle" && (
        <>
          <label className="toggle-row">
            <input type="checkbox" checked={params.cycleEnabled} onChange={(event) => updateParam("cycleEnabled", event.target.checked)} />
            创建环
          </label>
          <NumberInput label="环入口位置" value={params.cycleEntryIndex} min={0} onChange={(value) => updateParam("cycleEntryIndex", value)} />
        </>
      )}
      {algorithmId === "removeNth" && (
        <NumberInput label="倒数第 n 个" value={params.n} min={1} onChange={(value) => updateParam("n", value)} />
      )}
      {["reverse", "findMiddle", "swapPairs"].includes(algorithmId) && (
        <p className="parameter-hint">这个算法不需要额外参数，直接使用当前链表。</p>
      )}
    </section>
  );
}

function NumberInput({ label, value, min, onChange }: {
  label: string;
  value: number;
  min?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="param-field">
      <span>{label}</span>
      <input type="number" value={value} min={min} step={1} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}
