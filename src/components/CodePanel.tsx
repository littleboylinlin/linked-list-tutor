import type { AlgorithmId } from '../algorithms';
import { codeSnippets, languageLabels, mapActiveLines, type CodeLanguage } from '../codeSnippets';

export function CodePanel({
  algorithmId,
  language,
  activeLines,
  onLanguageChange,
}: {
  algorithmId: AlgorithmId;
  language: CodeLanguage;
  activeLines: number[];
  onLanguageChange: (language: CodeLanguage) => void;
}) {
  const snippet = codeSnippets[algorithmId][language];
  const mappedActiveLines = mapActiveLines(algorithmId, language, activeLines);

  return (
    <aside className="code-panel">
      <div className="code-header">
        <div className="window-title">
          <span className="dot red" />
          <span className="dot yellow" />
          <span className="dot green" />
          <strong>{snippet.fileName}</strong>
        </div>
        <div className="language-tabs" aria-label="code language">
          {(['cpp', 'c', 'python'] as CodeLanguage[]).map((item) => (
            <button
              key={item}
              className={language === item ? 'active' : ''}
              onClick={() => onLanguageChange(item)}
            >
              {languageLabels[item]}
            </button>
          ))}
        </div>
      </div>
      <pre className="code-block">
        {snippet.lines.map((line, index) => {
          const lineNumber = index + 1;
          const active = mappedActiveLines.includes(lineNumber);
          return (
            <code key={lineNumber} className={active ? 'active-line' : ''}>
              <span className="line-number">{lineNumber}</span>
              <span>{line}</span>
            </code>
          );
        })}
      </pre>
    </aside>
  );
}
