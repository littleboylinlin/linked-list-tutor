import { useEffect, useMemo, useRef, useState } from "react";
import { algorithms, type AlgorithmId } from "./algorithms";
import { AlgorithmSidebar } from "./components/AlgorithmSidebar";
import { AnimationCanvas } from "./components/AnimationCanvas";
import { CodePanel } from "./components/CodePanel";
import { StepController } from "./components/StepController";
import { useStepPlayback } from "./hooks/useStepPlayback";
import { useTutorInputs } from "./hooks/useTutorInputs";
import { getPlaybackDelay, type SpeedMode } from "./playback/speed";
import type { CodeLanguage } from "./codeSnippets";

function App() {
  const [algorithmId, setAlgorithmId] = useState<AlgorithmId>("reverse");
  const [speedMode, setSpeedMode] = useState<SpeedMode>("normal");
  const [codeLanguage, setCodeLanguage] = useState<CodeLanguage>("cpp");
  const { input, setInput, appliedValues, params, updateParam, applyInput } = useTutorInputs();
  const algorithm = algorithms.find((item) => item.id === algorithmId) ?? algorithms[0];
  const steps = useMemo(() => algorithm.makeSteps(appliedValues, params), [algorithm, appliedValues, params]);
  const playback = useStepPlayback(steps, { delay: getPlaybackDelay(speedMode, algorithmId) });
  const { step, index } = playback;
  const progress = steps.length > 1 ? (index / (steps.length - 1)) * 100 : 100;

  useKeyboardShortcuts(playback);

  return (
    <div className="app-shell">
      <AlgorithmSidebar
        algorithmId={algorithmId}
        onSelect={setAlgorithmId}
        input={input}
        onInputChange={setInput}
        onApplyInput={applyInput}
        params={params}
        updateParam={updateParam}
        speedMode={speedMode}
        onSpeedChange={setSpeedMode}
      />
      <main className="workspace">
        <section className="stage-card">
          <header className="stage-header">
            <div className="stage-heading">
              <h2>{algorithm.title}</h2>
              <div className="phase-line">
                <span className="phase-chip">{step.phase}</span>
                <span className="phase-title">{step.title}</span>
              </div>
            </div>
            <div className="step-meter">
              <span className="step-count">
                <strong>{index + 1}</strong>
                <span>/ {steps.length}</span>
              </span>
              <div className="progress-track" role="progressbar" aria-label="步骤进度" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={index + 1}>
                <div style={{ width: `${progress}%` }} />
              </div>
            </div>
          </header>
          <AnimationCanvas step={step} />
        </section>
        <CodePanel algorithmId={algorithm.id} language={codeLanguage} activeLines={step.activeLines} onLanguageChange={setCodeLanguage} />
        <StepController
          explanation={step.explanation}
          canPrev={playback.canPrev}
          canNext={playback.canNext}
          isPlaying={playback.isPlaying}
          onPrev={playback.previous}
          onNext={playback.next}
          onTogglePlay={playback.togglePlay}
          onReset={playback.reset}
        />
      </main>
    </div>
  );
}

type ShortcutTarget = {
  canPrev: boolean;
  canNext: boolean;
  previous: () => void;
  next: () => void;
  togglePlay: () => void;
};

/** ← / → step through the timeline, space toggles autoplay (ignored while typing). */
function useKeyboardShortcuts(playback: ShortcutTarget) {
  const latest = useRef(playback);
  latest.current = playback;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      const current = latest.current;
      if (event.key === "ArrowRight" && current.canNext) {
        event.preventDefault();
        current.next();
      } else if (event.key === "ArrowLeft" && current.canPrev) {
        event.preventDefault();
        current.previous();
      } else if (event.key === " " && !target?.closest("button")) {
        event.preventDefault();
        current.togglePlay();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}

export default App;
