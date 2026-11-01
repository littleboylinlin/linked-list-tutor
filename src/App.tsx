import { useMemo, useState } from "react";
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

  return (
    <main className="app-shell">
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
      <section className="visual-area">
        <div className="visual-header">
          <div>
            <span className="eyebrow">Phase {index + 1} / {steps.length}</span>
            <h2>{algorithm.title}</h2>
          </div>
          <div className="progress-track" role="progressbar" aria-label="phase progress" aria-valuemin={1} aria-valuemax={steps.length} aria-valuenow={index + 1}>
            <div style={{ width: `${((index + 1) / steps.length) * 100}%` }} />
          </div>
        </div>
        <div className="phase-chip-row"><span>{step.phase}</span><strong>{step.title}</strong></div>
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
  );
}

export default App;
