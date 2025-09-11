import type { QueryParser } from '../../../../../lib/QueryLanguage/QueryParser';

type ParseResultProps = {
  query: string;
  queryParser: QueryParser;
};

export default function ParseResult(props: ParseResultProps) {
  const { query, queryParser } = props;

  if (!query) return null;

  return (
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
  );
}
