import type { AlgorithmId } from "../algorithms";
import type { SpeedMode } from "../playback/speed";

export function SpeedPanel({ speedMode, setSpeedMode, algorithmId }: {
  speedMode: SpeedMode;
  setSpeedMode: (value: SpeedMode) => void;
  algorithmId: AlgorithmId;
}) {
  return (
    <section className="panel speed-panel">
      <h2>播放速度</h2>
      <div className="segmented-control">
        {(["slow", "normal", "fast"] as const).map((mode) => (
          <button key={mode} type="button" className={speedMode === mode ? "active" : ""} aria-pressed={speedMode === mode} onClick={() => setSpeedMode(mode)}>
            {mode === "slow" ? "慢速" : mode === "normal" ? "正常" : "快速"}
          </button>
        ))}
      </div>
      {algorithmId === "reverseKGroup" && speedMode === "normal" && (
        <p className="parameter-hint">K 个一组反转在正常速度下会自动放慢，方便看清断箭头和接箭头。</p>
      )}
    </section>
  );
}
