import { useCallback, useState } from 'react';
import type { KeyConfig } from '../../../../lib/QueryLanguage/types';
import { QueryInput } from '../../../../components/QueryInput';
import { basicParserExample } from '../../../../lib/QueryLanguage/examples/basicUsage';

export default function QueryLanguageTab() {
  const [query, setQuery] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);

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
      // values: [
      //   { value: 'john.doe@company.com', description: "John Doe's email" },
      //   { value: 'jane.smith@company.com', description: "Jane Smith's email" },
      //   { value: 'mike.johnson@company.com', description: "Mike Johnson's email" },
      //   { value: 'sarah.wilson@company.com', description: "Sarah Wilson's email" },
      //   { value: 'alex.chen@company.com', description: "Alex Chen's email" },
      // ],
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
    '(priority: critical OR priority: high) AND assignee: "john@company.com"',
    'created: "2024-01-01" AND status: active',
    'location: remote AND department: engineering',
    'role: senior OR role: manager',
    'email: "jane.smith@company.com" AND status: active',
  ];

  return (
    <div className='p-6 max-w-4xl mx-auto bg-black'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>Query Language Demo</h1>

        <button
          type='button'
          onClick={basicParserExample}
          className='block w-24 text-center p-3 bg-blue-500 hover:bg-gray-100 rounded-md transition-colors'
        >
          <code className='text-sm'>Click</code>
        </button>

        <p className='text-gray-600 mb-6'>
          Try typing in the query input below. The auto-completion engine will suggest keys, values, operators, and
          provide real-time validation. Use syntax like: <code>key: value AND (key: value OR key: value)</code>
        </p>
      </div>

      <div className='space-y-6'>
        {/* Query Input Section */}
        <div className='bg-gray-700 rounded-lg border border-gray-200 p-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Enter Query</h2>

          <div className='space-y-4'>
            <QueryInput
              value={query}
              onChange={setQuery}
              keyConfigs={keyConfigs}
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
        <div className='bg-gray-700 rounded-lg border border-gray-200 p-6'>
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
        <div className='bg-gray-700 rounded-lg border border-gray-200 p-6'>
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
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Available Keys & Values</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {keyConfigs.map((keyConfig) => (
              <div key={keyConfig.name} className='border border-gray-200 rounded-lg p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm font-medium'>
                    {keyConfig.name}
                  </span>
                  <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded'>{keyConfig.valueType}</span>
                </div>
                {keyConfig.description && <p className='text-sm text-gray-600 mb-2'>{keyConfig.description}</p>}
                {keyConfig.values && keyConfig.values.length > 0 && (
                  <div>
                    <div className='text-xs font-medium text-gray-700 mb-1'>Sample Values:</div>
                    <div className='space-y-1'>
                      {keyConfig.values.slice(0, 3).map((value, idx) => (
                        <div key={idx} className='text-xs'>
                          <code className='bg-gray-100 px-1 rounded text-gray-800'>{value.value}</code>
                          {value.description && <span className='ml-1 text-gray-500'>- {value.description}</span>}
                        </div>
                      ))}
                      {keyConfig.values.length > 3 && (
                        <div className='text-xs text-gray-500'>... and {keyConfig.values.length - 3} more values</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
