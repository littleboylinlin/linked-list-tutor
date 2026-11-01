import { useState } from 'react';
import type { AlgorithmId } from '../algorithms';
import { ChevronDownIcon } from './icons';
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
  // Mobile only: the code starts collapsed (CSS ignores this on desktop).
  const [open, setOpen] = useState(false);

  return (
    <aside className={`code-panel ${open ? 'open' : ''}`}>
      <div className="code-header">
        <div className="window-title">
          <span className="file-badge">{languageLabels[language]}</span>
          <strong>{snippet.fileName}</strong>
        </div>
        <button type="button" className="code-toggle" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          {open ? '收起代码' : '展开代码'}
          <ChevronDownIcon size={14} />
        </button>
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
