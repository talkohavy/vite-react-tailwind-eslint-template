import { useCallback, useState } from 'react';
import { QueryInput } from '../../components/QueryInput';

export default function QueryPage() {
  const [query, setQuery] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

  const availableKeys = [
    'name',
    'email',
    'status',
    'category',
    'department',
    'role',
    'location',
    'priority',
    'assignee',
    'created',
    'updated',
  ];

  const handleValidationChange = useCallback((valid: boolean, validationErrors: string[]) => {
    setIsValid(valid);
    setErrors(validationErrors);
  }, []);

  function handleSubmit() {
    if (isValid && query.trim()) {
      alert(`Executing query: ${query}`);
    }
  }

  function handleClear() {
    setQuery('');
  }

  const examples = [
    'name: "John Doe"',
    'status: active AND category: urgent',
    'department: engineering OR role: manager',
    '(priority: high OR priority: critical) AND assignee: "jane@example.com"',
    'created: "2024-01-01" AND status: completed',
  ];

  return (
    <div className='p-6 max-w-4xl mx-auto'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>Query Language Demo</h1>
        <p className='text-gray-600 mb-6'>
          Try typing in the query input below. The auto-completion engine will suggest keys, operators, and provide
          real-time validation. Use syntax like: <code>key: value AND (key: value OR key: value)</code>
        </p>
      </div>

      <div className='space-y-6'>
        {/* Query Input Section */}
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Enter Query</h2>

          <div className='space-y-4'>
            <QueryInput
              value={query}
              onChange={setQuery}
              availableKeys={availableKeys}
              placeholder='Type a query... (e.g., name: John)'
              showValidation={true}
              onValidationChange={handleValidationChange}
              className='text-base'
              testId='demo-query-input'
            />

            <div className='flex gap-2'>
              <button
                type='button'
                onClick={handleSubmit}
                disabled={!isValid || !query.trim()}
                className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
              >
                Execute Query
              </button>

              <button
                type='button'
                onClick={handleClear}
                className='px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors'
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Status Section */}
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Query Status</h2>

          <div className='space-y-3'>
            <div className='flex items-center gap-2'>
              <span className='font-medium'>Status:</span>
              <span
                className={`px-2 py-1 rounded text-sm font-medium ${
                  isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {isValid ? '✓ Valid' : '✗ Invalid'}
              </span>
            </div>

            <div>
              <span className='font-medium'>Current Query:</span>
              <code className='ml-2 px-2 py-1 bg-gray-100 rounded text-sm'>{query || '(empty)'}</code>
            </div>

            {errors.length > 0 && (
              <div>
                <span className='font-medium text-red-600'>Errors:</span>
                <ul className='mt-1 list-disc list-inside text-sm text-red-600'>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Examples Section */}
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Example Queries</h2>
          <p className='text-gray-600 mb-4'>Click any example to try it out:</p>

          <div className='space-y-2'>
            {examples.map((example, index) => (
              <button
                key={index}
                type='button'
                onClick={() => setQuery(example)}
                className='block w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors'
              >
                <code className='text-sm'>{example}</code>
              </button>
            ))}
          </div>
        </div>

        {/* Available Keys */}
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Available Keys</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2'>
            {availableKeys.map((key) => (
              <span key={key} className='px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium'>
                {key}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
