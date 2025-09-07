import { useState } from 'react';
import {
  QueryParser,
  CompletionEngine,
  type CompletionItem,
  type ParseResult,
  type KeyConfig,
} from '../../lib/QueryLanguage';

export default function QueryShowcase() {
  const [demoQuery, setDemoQuery] = useState('name: "John" AND (status: active OR priority: high)');
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [completions, setCompletions] = useState<CompletionItem[]>([]);

  const keyConfigs: KeyConfig[] = [
    {
      name: 'name',
      description: 'User name',
      valueType: 'string',
      values: [
        { value: 'John Doe', description: 'Software Engineer' },
        { value: 'Jane Smith', description: 'Product Manager' },
        { value: 'Mike Johnson', description: 'Designer' },
      ],
    },
    {
      name: 'status',
      description: 'Account status',
      valueType: 'enum',
      values: [
        { value: 'active', description: 'Active user' },
        { value: 'inactive', description: 'Inactive user' },
        { value: 'pending', description: 'Pending approval' },
      ],
    },
    {
      name: 'priority',
      description: 'Task priority level',
      valueType: 'enum',
      values: [
        { value: 'low', description: 'Low priority' },
        { value: 'medium', description: 'Medium priority' },
        { value: 'high', description: 'High priority' },
        { value: 'critical', description: 'Critical priority' },
      ],
    },
    {
      name: 'department',
      description: 'User department',
      valueType: 'enum',
      values: [
        { value: 'engineering', description: 'Engineering team' },
        { value: 'design', description: 'Design team' },
        { value: 'product', description: 'Product team' },
        { value: 'marketing', description: 'Marketing team' },
      ],
    },
    { name: 'email', description: 'Email address', valueType: 'string' },
    { name: 'created', description: 'Creation date', valueType: 'date' },
    { name: 'score', description: 'Numeric score', valueType: 'number' },
  ];

  // Initialize parser and completion engine
  const parser = new QueryParser();
  const completionEngine = new CompletionEngine({
    keys: keyConfigs,
    caseSensitive: false,
    fuzzyMatch: true,
    maxSuggestions: 8,
  });

  function handleParseQuery() {
    const result = parser.parse(demoQuery);
    setParseResult(result);
  }

  function handleGetCompletions() {
    const cursorPosition = demoQuery.length;
    const suggestions = completionEngine.getCompletions(demoQuery, cursorPosition);
    setCompletions(suggestions);
  }

  function renderASTNode(node: any, depth = 0): React.ReactNode {
    if (!node) return null;

    switch (node.type) {
      case 'query':
        return (
          <div>
            <span className='text-purple-600 font-semibold'>QueryExpression</span>
            <div className='ml-4'>{renderASTNode(node.expression, depth + 1)}</div>
          </div>
        );

      case 'boolean':
        return (
          <div>
            <span className='text-blue-600 font-semibold'>BooleanExpression</span>
            <span className='ml-2 text-gray-600'>operator: {node.operator}</span>
            <div className='ml-4'>
              <div className='text-sm text-gray-500'>left:</div>
              <div className='ml-2'>{renderASTNode(node.left, depth + 1)}</div>
              <div className='text-sm text-gray-500'>right:</div>
              <div className='ml-2'>{renderASTNode(node.right, depth + 1)}</div>
            </div>
          </div>
        );

      case 'condition':
        return (
          <div>
            <span className='text-green-600 font-semibold'>ConditionExpression</span>
            <span className='ml-2 text-gray-600'>
              {node.key} {node.comparator} "{node.value}"
            </span>
          </div>
        );

      case 'group':
        return (
          <div>
            <span className='text-orange-600 font-semibold'>GroupExpression</span>
            <div className='ml-4'>{renderASTNode(node.expression, depth + 1)}</div>
          </div>
        );

      default:
        return <span className='text-red-500'>Unknown node type: {node.type}</span>;
    }
  }

  return (
    <div className='p-6 max-w-6xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>Query Language Technical Showcase</h1>
        <p className='text-gray-600'>
          This showcase demonstrates the internal workings of the query language parser and auto-completion engine.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Parser Demo */}
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Parser Demo</h2>

          <div className='space-y-4'>
            <div>
              <label htmlFor='parse-query' className='block text-sm font-medium text-gray-700 mb-2'>
                Query to Parse:
              </label>
              <textarea
                id='parse-query'
                value={demoQuery}
                onChange={(e) => setDemoQuery(e.target.value)}
                className='w-full h-20 p-3 border border-gray-300 rounded-md resize-none font-mono text-sm'
                placeholder='Enter a query to parse...'
              />
            </div>

            <button
              onClick={handleParseQuery}
              className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
              type='button'
            >
              Parse Query
            </button>

            {parseResult && (
              <div className='mt-4'>
                <h3 className='font-medium text-gray-900 mb-2'>Parse Result:</h3>
                <div className={`p-3 rounded-md text-sm ${parseResult.success ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className='font-medium mb-2'>
                    Status:{' '}
                    <span className={parseResult.success ? 'text-green-600' : 'text-red-600'}>
                      {parseResult.success ? 'Success' : 'Failed'}
                    </span>
                  </div>

                  {parseResult.errors.length > 0 && (
                    <div className='mb-3'>
                      <div className='font-medium text-red-600 mb-1'>Errors:</div>
                      {parseResult.errors.map((error, index) => (
                        <div key={index} className='text-red-600 text-xs'>
                          • {error.message} (line {error.position.line}, col {error.position.column})
                        </div>
                      ))}
                    </div>
                  )}

                  {parseResult.ast && (
                    <div>
                      <div className='font-medium text-gray-700 mb-2'>Abstract Syntax Tree:</div>
                      <div className='bg-white p-3 rounded border font-mono text-xs overflow-auto max-h-64'>
                        {renderASTNode(parseResult.ast)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Completion Engine Demo */}
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Auto-Completion Demo</h2>

          <div className='space-y-4'>
            <div>
              <label htmlFor='completion-query' className='block text-sm font-medium text-gray-700 mb-2'>
                Incomplete Query:
              </label>
              <textarea
                id='completion-query'
                value={demoQuery}
                onChange={(e) => setDemoQuery(e.target.value)}
                className='w-full h-20 p-3 border border-gray-300 rounded-md resize-none font-mono text-sm'
                placeholder='Type partial query for completions...'
              />
            </div>

            <button
              onClick={handleGetCompletions}
              className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors'
              type='button'
            >
              Get Completions
            </button>

            {completions.length > 0 && (
              <div>
                <h3 className='font-medium text-gray-900 mb-2'>Completions:</h3>
                <div className='space-y-2 max-h-64 overflow-auto'>
                  {completions.map((completion, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-2 bg-gray-50 rounded border text-sm'
                    >
                      <div className='flex items-center gap-2'>
                        <span className='font-mono font-medium'>{completion.text}</span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            completion.type === 'key'
                              ? 'bg-blue-100 text-blue-800'
                              : completion.type === 'value'
                                ? 'bg-green-100 text-green-800'
                                : completion.type === 'operator'
                                  ? 'bg-purple-100 text-purple-800'
                                  : completion.type === 'grouping'
                                    ? 'bg-orange-100 text-orange-800'
                                    : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {completion.type}
                        </span>
                      </div>
                      <div className='text-xs text-gray-500 font-medium'>Priority: {completion.priority}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Configuration Display */}
      <div className='mt-6 bg-white rounded-lg border border-gray-200 p-6'>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>Configured Keys</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {keyConfigs.map((keyConfig, index) => (
            <div key={index} className='border border-gray-200 rounded-lg p-4'>
              <div className='font-medium text-gray-900'>{keyConfig.name}</div>
              <div className='text-sm text-gray-600 mb-2'>{keyConfig.description}</div>
              <div className='text-xs text-gray-500 mb-2'>Type: {keyConfig.valueType}</div>
              {keyConfig.values && keyConfig.values.length > 0 && (
                <div>
                  <div className='text-xs font-medium text-gray-700 mb-1'>Values:</div>
                  <div className='space-y-1'>
                    {keyConfig.values.slice(0, 3).map((value, idx) => (
                      <div key={idx} className='text-xs'>
                        <code className='bg-gray-100 px-1 rounded'>{value.value}</code>
                        {value.description && <span className='ml-1 text-gray-500'>- {value.description}</span>}
                      </div>
                    ))}
                    {keyConfig.values.length > 3 && (
                      <div className='text-xs text-gray-500'>... and {keyConfig.values.length - 3} more</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
