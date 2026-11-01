import { NextIcon, PauseIcon, PlayIcon, PrevIcon, ResetIcon } from "./icons";

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
      <div className="explain">
        <span className="explain-label">讲解</span>
        <p key={explanation} aria-live="polite">{explanation}</p>
      </div>
      <div className="controls">
        <button type="button" className="ctrl" onClick={onReset} title="重置">
          <ResetIcon size={16} />
          <span className="ctrl-text">重置</span>
        </button>
        <div className="ctrl-group">
          <button type="button" className="ctrl" onClick={onPrev} disabled={!canPrev} title="上一步 (←)">
            <PrevIcon />
            <span className="ctrl-text">上一步</span>
          </button>
          <button type="button" className="ctrl play" onClick={onTogglePlay} disabled={!canNext} title="自动播放 (空格)">
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
            <span>{isPlaying ? "暂停" : "播放"}</span>
          </button>
          <button type="button" className="ctrl primary" onClick={onNext} disabled={!canNext} title="下一步 (→)">
            <span>下一步</span>
            <NextIcon />
          </button>
        </div>
      </div>
    </footer>
  );
}
