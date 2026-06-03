export function StepController({
  explanation,
  canPrev,
  canNext,
  isPlaying,
  onPrev,
  onNext,
  onTogglePlay,
  onReset,
}: {
  explanation: string;
  canPrev: boolean;
  canNext: boolean;
  isPlaying: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onReset: () => void;
}) {
  return (
    <footer className="control-bar">
      <div>
        <span className="eyebrow">当前解释</span>
        <p>{explanation}</p>
      </div>
      <div className="controls">
        <button onClick={onPrev} disabled={!canPrev}>上一步</button>
        <button className="primary" onClick={onNext} disabled={!canNext}>下一步</button>
        <button onClick={onTogglePlay} disabled={!canNext}>{isPlaying ? '暂停' : '自动播放'}</button>
        <button onClick={onReset}>重置</button>
      </div>
    </footer>
  );
}
