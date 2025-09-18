import { useState, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism.css';

// Define custom grammar for your query language
Prism.languages.queryLang = {
  comment: [
    {
      pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
      lookbehind: true,
    },
    {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: true,
      greedy: true,
    },
  ],
  operator: /:/,
  'boolean-operator': {
    pattern: /\b(?:AND|OR|NOT)\b/i,
    alias: 'keyword',
  },
  punctuation: /[()]/,
  key: {
    pattern: /\b[a-zA-Z_][a-zA-Z0-9_]*(?=\s*:)/,
    alias: 'property',
  },
  string: {
    pattern: /(["'])((?:\\.|(?!\1)[^\\\r\n])*)\1/,
    greedy: true,
  },
  number: /\b\d+(?:\.\d+)?\b/,
  value: {
    pattern: /(?<=:\s*)[^"\s()]+(?=\s|$|[()])/,
    lookbehind: true,
    alias: 'constant',
  },
};

type Language = 'queryLang';

const codeExamples: Record<Language, string> = {
  queryLang: `(name: "John" OR name: "Jane") AND age: 25`,
};

export default function TestPage() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('queryLang');
  const [code, setCode] = useState(codeExamples.queryLang);

  // Add custom CSS for query language highlighting
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Custom styles for query language */
      .token.property {
        color: #0969da !important; /* Blue for keys */
        font-weight: 600;
      }
      .token.keyword {
        color: white !important; /* Red for AND, OR, NOT */
        font-weight: bold;
        background-color: oklch(62.3% 0.214 259.815); /* Highlight background */
        // padding: 0 2px;
        border-radius: 4px;
      }
      .token.operator {
        color: #8250df !important; /* Purple for : */
        font-weight: bold;
      }
      .token.constant {
        color: #0550ae !important; /* Dark blue for values */
      }
      .token.string {
        color: #0a3069 !important; /* Dark blue for quoted strings */
      }
      .token.number {
        color: #0969da !important; /* Blue for numbers */
      }
      .token.punctuation {
        color: #656d76 !important; /* Gray for parentheses */
      }
      .token.comment {
        color: #6e7781 !important; /* Gray for comments */
        font-style: italic;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  function handleLanguageChange(language: Language) {
    setSelectedLanguage(language);
    setCode(codeExamples[language]);
  }

  function getLanguageDisplayName(language: Language): string {
    const displayNames: Record<Language, string> = {
      queryLang: 'QUERY LANGUAGE',
    };
    return displayNames[language];
  }

  function highlightCode(code: string) {
    try {
      const languageMap: Record<Language, any> = {
        queryLang: Prism.languages.queryLang,
      };

      const grammar = languageMap[selectedLanguage];

      if (!grammar) {
        return code; // Return plain code if no grammar available
      }

      return Prism.highlight(code, grammar, selectedLanguage);
    } catch (error) {
      console.warn('Syntax highlighting failed:', error);
      return code; // Fallback to plain code
    }
  }

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>React Simple Code Editor Demo</h1>
        <p className='text-gray-600 mb-8'>
          A simple, lightweight code editor with syntax highlighting powered by PrismJS.
        </p>

        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
          {/* Language Selector */}
          <div className='bg-gray-100 border-b border-gray-200 px-6 py-4'>
            <div className='block text-sm font-medium text-gray-700 mb-2'>Select Language:</div>
            <div className='flex flex-wrap gap-2'>
              {(Object.keys(codeExamples) as Language[]).map((language) => (
                <button
                  key={language}
                  type='button'
                  onClick={() => handleLanguageChange(language)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedLanguage === language
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {getLanguageDisplayName(language)}
                </button>
              ))}
            </div>
          </div>

          {/* Code Editor */}
          <div className='p-6'>
            <h3 className='text-lg font-semibold text-gray-800 mb-4'>
              Code Editor ({getLanguageDisplayName(selectedLanguage)})
            </h3>
            <div className='border border-gray-300 rounded-md overflow-hidden'>
              <Editor
                value={code}
                onValueChange={setCode}
                highlight={highlightCode}
                padding={16}
                style={{
                  fontFamily: '"Fira Code", "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace',
                  fontSize: 14,
                  lineHeight: 1.5,
                  backgroundColor: '#fafafa',
                  minHeight: '300px',
                }}
                textareaClassName='focus:outline-none'
                preClassName='overflow-auto'
              />
            </div>
          </div>
        </div>

        {/* Code Output Preview */}
        <div className='mt-8 bg-white rounded-lg shadow-lg overflow-hidden'>
          <div className='bg-gray-100 border-b border-gray-200 px-6 py-4'>
            <h3 className='text-lg font-semibold text-gray-800'>Raw Code Output</h3>
          </div>
          <div className='p-6'>
            <pre className='bg-gray-100 p-4 rounded-md overflow-auto text-sm'>
              <code>{code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
