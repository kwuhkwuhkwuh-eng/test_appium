import { useState } from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-xl overflow-hidden border border-gray-700/50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <span className="text-xs text-gray-500 ml-2 font-mono">{language}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs text-gray-400 hover:text-white hover:bg-gray-700 transition-all"
        >
          {copied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Скопировано!
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Копировать
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="p-4 text-sm leading-relaxed">
          <code className="text-gray-300 font-mono whitespace-pre">
            {code.split('\n').map((line, i) => (
              <div key={i} className="flex">
                <span className="inline-block w-8 text-right mr-4 text-gray-600 select-none text-xs leading-relaxed">
                  {i + 1}
                </span>
                <span className="flex-1">
                  <HighlightedLine line={line} language={language} />
                </span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

function HighlightedLine({ line, language }: { line: string; language: string }) {
  // Simple syntax highlighting
  const parts: { text: string; className: string }[] = [];
  
  if (language === 'bash') {
    if (line.trim().startsWith('#')) {
      return <span className="text-gray-500 italic">{line}</span>;
    }
    // Highlight commands
    const words = line.split(' ');
    return (
      <span>
        {words.map((word, i) => {
          if (i === 0 && (word === 'npm' || word === 'appium' || word === 'npx' || word === 'pip' || word === 'mvn' || word === 'pytest' || word === 'export' || word === 'source')) {
            return <span key={i} className="text-purple-400">{word}{i < words.length - 1 ? ' ' : ''}</span>;
          }
          if (word.startsWith('-') || word.startsWith('--')) {
            return <span key={i} className="text-yellow-400">{word}{i < words.length - 1 ? ' ' : ''}</span>;
          }
          if (word.startsWith('$')) {
            return <span key={i} className="text-green-400">{word}{i < words.length - 1 ? ' ' : ''}</span>;
          }
          return <span key={i}>{word}{i < words.length - 1 ? ' ' : ''}</span>;
        })}
      </span>
    );
  }

  // For programming languages
  if (line.trim().startsWith('//') || line.trim().startsWith('#') || line.trim().startsWith('*') || line.trim().startsWith('/*')) {
    return <span className="text-gray-500 italic">{line}</span>;
  }

  // Simple keyword highlighting
  const keywords = ['const', 'let', 'var', 'function', 'class', 'import', 'from', 'export', 'default', 'async', 'await', 'return', 'if', 'else', 'for', 'while', 'try', 'catch', 'new', 'this', 'def', 'self', 'yield', 'public', 'private', 'static', 'void', 'int', 'String', 'boolean', 'package', 'extends', 'implements'];
  
  let result = line;
  const segments: JSX.Element[] = [];
  let remaining = line;
  let key = 0;

  // Highlight strings
  const stringRegex = /(["'`])(?:(?=(\\?))\2.)*?\1/g;
  let lastIndex = 0;
  let match;
  
  while ((match = stringRegex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      segments.push(<span key={key++}>{highlightKeywords(line.slice(lastIndex, match.index), keywords)}</span>);
    }
    segments.push(<span key={key++} className="text-green-400">{match[0]}</span>);
    lastIndex = match.index + match[0].length;
  }
  
  if (lastIndex < line.length) {
    segments.push(<span key={key++}>{highlightKeywords(line.slice(lastIndex), keywords)}</span>);
  }

  if (segments.length === 0) {
    return <span>{highlightKeywords(line, keywords)}</span>;
  }

  return <>{segments}</>;
}

function highlightKeywords(text: string, keywords: string[]): JSX.Element {
  const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, i) => {
        if (keywords.includes(part)) {
          return <span key={i} className="text-purple-400">{part}</span>;
        }
        // Numbers
        const numRegex = /^(\d+)$/;
        if (numRegex.test(part)) {
          return <span key={i} className="text-orange-400">{part}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}