import CursorPositionInfo from './content/CursorPositionInfo';
import QueryVisualization from './content/QueryVisualization';
import RawParseResult from './content/RawParseResult';
import TokenList from './content/TokenList';
import { useQueryParserTabLogic } from './logic/useQueryParserTabLogic';
import QueryInput from './QueryInput';

export default function QueryParserTab() {
  const { query, tokens, result, cursorPosition, currentToken, currentASTNode, whitespaceContext, handleInputChange } =
    useQueryParserTabLogic();

  return (
    <div className='p-6 max-w-6xl mx-auto bg-black'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>Query Parser Visualization</h1>

        <p className='text-gray-600 mb-6'>Try typing a query below to see how it gets parsed and visualized.</p>

        <p className='text-gray-600 mb-6'>Examples:</p>

        <pre className='text-gray-600 mb-6'>{'status: active AND role: admin'}</pre>

        <pre className='text-gray-600 mb-6'>
          {'key1:  val   AND (key2  ==  15  OR  (  key3 > 14  AND key4 == "exists"))    AND    key4  >=  100    '}
        </pre>
      </div>

      <div className='space-y-6'>
        <div className='bg-gray-700 rounded-lg border border-gray-200 p-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Enter Query</h2>

          <div className='space-y-4'>
            <QueryInput value={query} onChange={handleInputChange} placeholder='Type a query...' />

            <CursorPositionInfo
              cursorPosition={cursorPosition}
              currentToken={currentToken}
              currentASTNode={currentASTNode}
              whitespaceContext={whitespaceContext}
            />
          </div>
        </div>

        {query && <QueryVisualization query={query} tokens={tokens} parseResult={result} />}

        <RawParseResult result={result} />

        <TokenList tokens={tokens} />
      </div>
    </div>
  );
}
