import type { ParseResult } from '../../../../../../lib/QueryLanguage/QueryParser';

type RawParseResultProps = {
  result: ParseResult;
};

export default function RawParseResult(props: RawParseResultProps) {
  const { result } = props;

  return (
    <div className='bg-gray-700 rounded-lg border border-gray-200 p-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4'>Raw Parse Result</h2>

      {result && (
        <div className='bg-gray-800 rounded-lg p-4'>
          <h3 className='text-lg font-semibold text-gray-200 mb-2'>Parse Result:</h3>
          <pre className='text-gray-100 text-sm overflow-x-auto whitespace-pre-wrap'>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
