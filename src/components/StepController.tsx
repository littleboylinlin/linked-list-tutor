import { useEffect, useRef, useState } from "react";
import type { SpeedMode } from "../playback/speed";
import { MoreIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon, ResetIcon } from "./icons";

const speedLabels: Record<SpeedMode, string> = { slow: "慢速", normal: "正常", fast: "快速" };

export function StepController({
  explanation,
  canPrev,
  canNext,
  isPlaying,
  onPrev,
  onNext,
  onTogglePlay,
  onReset,
  speedMode,
  onSpeedChange,
}: {
  explanation: string;
  canPrev: boolean;
  canNext: boolean;
  isPlaying: boolean;
  onPrev: () => void;
  onNext: () => void;
  onTogglePlay: () => void;
  onReset: () => void;
  speedMode: SpeedMode;
  onSpeedChange: (speed: SpeedMode) => void;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!moreOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) setMoreOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMoreOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [moreOpen]);

  return (
    <footer className="control-bar">
      <div className="explain">
        <span className="explain-label">NOTE 讲解</span>
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
        {/* Mobile only: speed lives behind a "more" button to keep the fixed bar short. */}
        <div className="more-wrap" ref={moreRef}>
          <button
            type="button"
            className="ctrl more-toggle"
            aria-haspopup="true"
            aria-expanded={moreOpen}
            aria-label="更多设置"
            title="更多"
            onClick={() => setMoreOpen((open) => !open)}
          >
            <MoreIcon />
          </button>
          {moreOpen && (
            <div className="more-panel" role="group" aria-label="更多设置">
              <span className="more-title">SPEED 播放速度</span>
              <div className="segmented">
                {(["slow", "normal", "fast"] as const).map((mode) => (
                  <button key={mode} type="button" className={speedMode === mode ? "active" : ""} aria-pressed={speedMode === mode} onClick={() => onSpeedChange(mode)}>
                    {speedLabels[mode]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
