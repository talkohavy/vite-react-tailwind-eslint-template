import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { TokenContext, TokenContextWithKey } from '../../../../lib/QueryLanguage/types';
import type { CompletionItem, KeyConfig } from './types';
import { ContextTypes, QueryParser } from '../../../../lib/QueryLanguage/QueryParser';

export default function QueryLanguageTab() {
  const [query, setQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize QueryParser and key configs
  const { queryParser, keyConfigs } = useMemo(() => {
    const keyConfigs: KeyConfig[] = [
      {
        name: 'name',
        description: 'User full name',
        valueType: 'string',
        values: [
          { value: 'John Doe', description: 'Software Engineer' },
          { value: 'Jane Smith', description: 'Product Manager' },
          { value: 'Mike Johnson', description: 'UI/UX Designer' },
          { value: 'Sarah Wilson', description: 'Data Scientist' },
          { value: 'Alex Chen', description: 'DevOps Engineer' },
        ],
      },
      {
        name: 'email',
        description: 'User email address',
        valueType: 'string',
      },
      {
        name: 'status',
        description: 'Account status',
        valueType: 'enum',
        values: [
          { value: 'active', description: 'User is currently active' },
          { value: 'inactive', description: 'User account is inactive' },
          { value: 'pending', description: 'Account pending approval' },
          { value: 'suspended', description: 'Account is suspended' },
          { value: 'archived', description: 'Account is archived' },
        ],
      },
      {
        name: 'category',
        description: 'Task or item category',
        valueType: 'enum',
        values: [
          { value: 'urgent', description: 'Requires immediate attention' },
          { value: 'normal', description: 'Standard priority' },
          { value: 'low', description: 'Can be addressed later' },
          { value: 'feature', description: 'New feature request' },
          { value: 'bug', description: 'Bug report or issue' },
        ],
      },
      {
        name: 'department',
        description: 'Department or team',
        valueType: 'enum',
        values: [
          { value: 'engineering', description: 'Software Engineering team' },
          { value: 'design', description: 'UI/UX Design team' },
          { value: 'product', description: 'Product Management team' },
          { value: 'marketing', description: 'Marketing team' },
          { value: 'sales', description: 'Sales team' },
          { value: 'support', description: 'Customer Support team' },
        ],
      },
      {
        name: 'role',
        description: 'Job role or position',
        valueType: 'enum',
        values: [
          { value: 'manager', description: 'Team manager' },
          { value: 'senior', description: 'Senior level position' },
          { value: 'mid', description: 'Mid-level position' },
          { value: 'junior', description: 'Junior level position' },
          { value: 'intern', description: 'Internship position' },
          { value: 'contractor', description: 'Contract worker' },
        ],
      },
      {
        name: 'location',
        description: 'Office location or region',
        valueType: 'enum',
        values: [
          { value: 'san-francisco', description: 'San Francisco, CA' },
          { value: 'new-york', description: 'New York, NY' },
          { value: 'austin', description: 'Austin, TX' },
          { value: 'seattle', description: 'Seattle, WA' },
          { value: 'remote', description: 'Remote worker' },
          { value: 'london', description: 'London, UK' },
        ],
      },
      {
        name: 'priority',
        description: 'Task priority level',
        valueType: 'enum',
        values: [
          { value: 'critical', description: 'Critical - fix immediately' },
          { value: 'high', description: 'High priority' },
          { value: 'medium', description: 'Medium priority' },
          { value: 'low', description: 'Low priority' },
        ],
      },
      {
        name: 'assignee',
        description: 'Person assigned to task',
        valueType: 'string',
        values: [
          { value: 'john@company.com', description: 'John Doe' },
          { value: 'jane@company.com', description: 'Jane Smith' },
          { value: 'mike@company.com', description: 'Mike Johnson' },
          { value: 'sarah@company.com', description: 'Sarah Wilson' },
          { value: 'alex@company.com', description: 'Alex Chen' },
        ],
      },
      {
        name: 'created',
        description: 'Creation date',
        valueType: 'date',
        values: [
          { value: '2024-01-01', description: 'January 1st, 2024' },
          { value: '2024-06-01', description: 'June 1st, 2024' },
          { value: '2024-12-01', description: 'December 1st, 2024' },
        ],
      },
      {
        name: 'updated',
        description: 'Last update date',
        valueType: 'date',
        values: [
          { value: '2024-08-01', description: 'August 1st, 2024' },
          { value: '2024-08-15', description: 'August 15th, 2024' },
          { value: '2024-08-25', description: 'August 25th, 2024' },
        ],
      },
    ];

    const parser = new QueryParser();

    return {
      queryParser: parser,
      keyConfigs,
    };
  }, []);

  // Simple completion generation function
  const generateCompletions = useCallback(
    (context: TokenContext | undefined, currentInput: string): CompletionItem[] => {
      if (!context) return [];

      const completions: CompletionItem[] = [];

      context.expectedTokens.forEach((type) => {
        switch (type) {
          case ContextTypes.Key: {
            keyConfigs.forEach((keyConfig) => {
              if (!currentInput || keyConfig.name.toLowerCase().includes(currentInput.toLowerCase())) {
                completions.push({
                  text: keyConfig.name,
                  type: ContextTypes.Key,
                  description: keyConfig.description,
                  priority: 10,
                });
              }
            });
            break;
          }
          case ContextTypes.Value:
          case ContextTypes.QuotedString: {
            const currentKeyToken = (context as TokenContextWithKey).key;
            const keyConfig = keyConfigs.find((k) => k.name === currentKeyToken);

            if (keyConfig?.values) {
              keyConfig.values.forEach((valueConfig) => {
                if (!currentInput || valueConfig.value.toLowerCase().includes(currentInput.toLowerCase())) {
                  const needsQuotes = valueConfig.value.includes(' ');
                  completions.push({
                    text: needsQuotes ? `"${valueConfig.value}"` : valueConfig.value,
                    type: needsQuotes ? ContextTypes.QuotedString : ContextTypes.Value,
                    description: valueConfig.description,
                    priority: 8,
                  });
                }
              });
            }
            break;
          }
          case ContextTypes.LogicalOperator: {
            if (!currentInput || 'AND'.toLowerCase().includes(currentInput.toLowerCase())) {
              completions.push({
                text: 'AND',
                type: ContextTypes.LogicalOperator,
                description: 'Logical AND operator',
                priority: 9,
              });
            }
            if (!currentInput || 'OR'.toLowerCase().includes(currentInput.toLowerCase())) {
              completions.push({
                text: 'OR',
                type: ContextTypes.LogicalOperator,
                description: 'Logical OR operator',
                priority: 9,
              });
            }
            break;
          }
          case ContextTypes.Comparator: {
            const comparators = [':', '==', '!=', '>', '<', '>=', '<='];
            comparators.forEach((comp, index) => {
              completions.push({
                text: comp,
                type: ContextTypes.Comparator,
                description: comp === ':' ? 'Basic comparison (most common)' : `Comparison operator: ${comp}`,
                priority: comp === ':' ? 10 : 7 - index, // Give ':' highest priority
              });
            });
            break;
          }
          case ContextTypes.Colon: {
            completions.push({
              text: ':',
              type: ContextTypes.Colon,
              description: 'Basic comparison operator',
              priority: 10,
            });
            break;
          }
          case ContextTypes.LeftParenthesis: {
            completions.push({
              text: '(',
              type: ContextTypes.LeftParenthesis,
              description: 'Start grouping with parentheses',
              priority: 6,
            });
            break;
          }
          case ContextTypes.RightParenthesis: {
            completions.push({
              text: ')',
              type: ContextTypes.RightParenthesis,
              description: 'End grouping with parentheses',
              priority: 6,
            });
            break;
          }
        }
      });

      const completionsSorted = completions.toSorted((a, b) => b.priority - a.priority); //.slice(0, 10);

      return completionsSorted;
    },
    [keyConfigs, query],
  );

  // Get completion context and suggestions
  const { completions, expectedTypes } = useMemo(() => {
    if (!query) {
      const context: TokenContext = { expectedTokens: [ContextTypes.Key] };

      return {
        completions: generateCompletions(context, ''),
        expectedTypes: [ContextTypes.Key],
      };
    }

    try {
      // Parse the query to get tokens with context
      const parseResult = queryParser.parse(query);

      // Find the current token at cursor position
      const currentToken = parseResult.tokens.find(
        (token) => cursorPosition >= token.position.start && cursorPosition <= token.position.end,
      );

      let expectedTypes: string[] = [];

      if (currentToken?.context?.expectedTokens) {
        // Use the expectedTokens directly from the current token
        expectedTypes = [...currentToken.context.expectedTokens];
      }

      const currentInput = ''; // Could be enhanced to get partial input
      const suggestions = generateCompletions(currentToken?.context, currentInput);

      return {
        completions: suggestions,
        expectedTypes,
      };
    } catch (error) {
      console.error('Error getting completions:', error);
      return {
        completions: [],
        expectedTypes: [],
      };
    }
  }, [query, cursorPosition, queryParser, generateCompletions]);

  // Update dropdown visibility based on expected types
  useEffect(() => {
    const shouldShowDropdown = expectedTypes.length > 0 && completions.length > 0;
    setIsDropdownOpen(shouldShowDropdown);
  }, [expectedTypes, completions]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setQuery(newValue);
    setCursorPosition(event.target.selectionStart || 0);
  }, []);

  const handleInputClick = useCallback((event: React.MouseEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    setCursorPosition(target.selectionStart || 0);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;

    // Update cursor position on key navigation
    setTimeout(() => {
      setCursorPosition(target.selectionStart || 0);
    }, 0);
  }, []);

  const handleCompletionSelect = useCallback((completion: CompletionItem) => {
    if (!inputRef.current) return;

    const input = inputRef.current;
    const value = input.value;
    const start = input.selectionStart || 0;

    // Find the start of the current token to replace
    let tokenStart = start;
    while (tokenStart > 0) {
      const prevChar = value[tokenStart - 1];
      if (prevChar && /[a-zA-Z0-9_-]/.test(prevChar)) {
        tokenStart--;
      } else {
        break;
      }
    }

    // Insert the completion
    const insertText = completion.insertText || completion.text;
    const newValue = value.substring(0, tokenStart) + insertText + value.substring(start);
    const newCursorPosition = tokenStart + insertText.length;

    setQuery(newValue);
    setCursorPosition(newCursorPosition);
    setIsDropdownOpen(false);

    // Focus back to input and set cursor position
    setTimeout(() => {
      input.focus();
      input.setSelectionRange(newCursorPosition, newCursorPosition);
    }, 0);
  }, []);

  const examples = [
    'name: "John Doe"',
    'status: active AND category: urgent',
    'department: engineering OR role: manager',
    '(priority: critical OR priority: high) AND assignee: "john@company.com"',
    'created: "2024-01-01" AND status: active',
    'location: remote AND department: engineering',
    'role: senior OR role: manager',
    'email: "jane.smith@company.com" AND status: active',
  ];

  return (
    <div className='p-6 max-w-4xl mx-auto bg-black'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-white mb-4'>Query Language System</h1>
        <p className='text-gray-300 mb-6'>
          Type a query below with intelligent autocomplete. The dropdown will show available keys, values, and operators
          based on context.
        </p>

        <div className='mb-6'>
          <h2 className='text-lg font-semibold text-white mb-3'>Examples:</h2>
          <div className='space-y-2'>
            {examples.map((example, index) => (
              <button
                key={index}
                type='button'
                className='text-sm text-gray-400 font-mono bg-gray-800 p-2 rounded cursor-pointer hover:bg-gray-700 transition-colors text-left w-full'
                onClick={() => {
                  setQuery(example);
                  setCursorPosition(example.length);
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className='space-y-6'>
        <div className='bg-gray-800 rounded-lg border border-gray-700 p-6'>
          <h2 className='text-xl font-semibold text-white mb-4'>Query Input</h2>

          <div className='relative'>
            <input
              ref={inputRef}
              type='text'
              value={query}
              onChange={handleInputChange}
              onClick={handleInputClick}
              onKeyDown={handleKeyDown}
              placeholder='Type your query... (e.g., status: active AND role: manager)'
              className='w-full px-4 py-3 text-lg font-mono bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />

            {/* Autocomplete Dropdown */}
            {isDropdownOpen && completions.length > 0 && (
              <div className='absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10'>
                {completions.map((completion: CompletionItem, index: number) => (
                  <button
                    key={`${completion.text}-${index}`}
                    type='button'
                    className='px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0 text-left w-full'
                    onClick={() => handleCompletionSelect(completion)}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center space-x-3'>
                        <span className='font-mono text-white'>{completion.text}</span>
                        <span className='text-xs px-2 py-1 bg-blue-600 text-white rounded'>{completion.type}</span>
                      </div>
                      <span className='text-xs text-gray-400'>Priority: {completion.priority}</span>
                    </div>
                    {completion.description && (
                      <div className='text-sm text-gray-400 mt-1'>{completion.description}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Context Information */}
          <div className='mt-4 p-4 bg-gray-900 rounded border border-gray-700'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
              <div>
                <span className='text-gray-400'>Cursor Position:</span>
                <span className='text-white ml-2'>{cursorPosition}</span>
              </div>
              <div>
                <span className='text-gray-400'>Expected Types:</span>
                <span className='text-white ml-2'>{expectedTypes.length > 0 ? expectedTypes.join(', ') : 'none'}</span>
              </div>
              <div>
                <span className='text-gray-400'>Suggestions:</span>
                <span className='text-white ml-2'>{completions.length}</span>
              </div>
            </div>

            {/* Debug info for testing */}
            <div className='mt-2 pt-2 border-t border-gray-700'>
              <div className='text-xs text-gray-500'>
                Debug: Query length: {query.length}, Cursor at: {cursorPosition}
                {query && (
                  <div className='mt-1'>
                    Query: "<span className='text-blue-400'>{query.substring(0, cursorPosition)}</span>
                    <span className='bg-yellow-600 text-black'>|</span>
                    <span className='text-blue-400'>{query.substring(cursorPosition)}</span>"
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Parse Result */}
        {query && (
          <div className='bg-gray-800 rounded-lg border border-gray-700 p-6'>
            <h3 className='text-lg font-semibold text-white mb-4'>Parse Result</h3>
            <div className='font-mono text-sm'>
              {(() => {
                try {
                  const result = queryParser.parse(query);
                  return (
                    <div>
                      <div className={`mb-2 ${result.success ? 'text-green-400' : 'text-red-400'}`}>
                        Status: {result.success ? 'Success' : 'Error'}
                      </div>
                      {!result.success && result.errors.length > 0 && (
                        <div className='text-red-400 mb-4'>
                          <div className='font-semibold mb-2'>Errors:</div>
                          {result.errors.map((error, index) => (
                            <div key={index} className='mb-1'>
                              • {error.message} (at position {error.position.start}-{error.position.end})
                            </div>
                          ))}
                        </div>
                      )}
                      {result.success && result.ast && (
                        <div className='text-gray-300'>
                          <div className='mb-2 text-white font-semibold'>AST Structure:</div>
                          <pre className='whitespace-pre-wrap bg-gray-900 p-3 rounded border border-gray-600 overflow-x-auto'>
                            {JSON.stringify(result.ast, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  );
                } catch (error) {
                  return (
                    <div className='text-red-400'>
                      Parse Error: {error instanceof Error ? error.message : 'Unknown error'}
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
