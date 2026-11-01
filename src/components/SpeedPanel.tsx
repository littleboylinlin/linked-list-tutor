import type { AlgorithmId } from "../algorithms";
import type { SpeedMode } from "../playback/speed";

const labels: Record<SpeedMode, string> = { slow: "慢速", normal: "正常", fast: "快速" };

export function SpeedPanel({ speedMode, setSpeedMode, algorithmId }: {
  speedMode: SpeedMode;
  setSpeedMode: (value: SpeedMode) => void;
  algorithmId: AlgorithmId;
}) {
  return (
    <section className="side-section">
      <h2 className="section-title">播放速度</h2>
      <div className="segmented" role="group" aria-label="播放速度">
        {(["slow", "normal", "fast"] as const).map((mode) => (
          <button key={mode} type="button" className={speedMode === mode ? "active" : ""} aria-pressed={speedMode === mode} onClick={() => setSpeedMode(mode)}>
            {labels[mode]}
          </button>
        ))}
      </div>
      {algorithmId === "reverseKGroup" && speedMode === "normal" && (
        <p className="hint">K 个一组反转在正常速度下会自动放慢，方便看清断箭头和接箭头。</p>
      )}
    </section>
  );
}
