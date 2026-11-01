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
          <span className="file-badge">{languageLabels[language]}</span>
          <strong>{snippet.fileName}</strong>
        </div>
        <div className="language-tabs" role="group" aria-label="代码语言">
          {(['cpp', 'c', 'python'] as CodeLanguage[]).map((item) => (
            <button
              key={item}
              type="button"
              aria-pressed={language === item}
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
              <span className="line-code">{line || ' '}</span>
            </code>
          );
        })}
      </pre>
    </aside>
  );
}
