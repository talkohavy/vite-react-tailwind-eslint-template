interface ContextInfoProps {
  cursorPosition: number;
  expectedTypes: string[];
  completions: { length: number };
  query: string;
}

export default function ContextInfo(props: ContextInfoProps) {
  const { cursorPosition, expectedTypes, completions, query } = props;

  return (
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
  );
}
