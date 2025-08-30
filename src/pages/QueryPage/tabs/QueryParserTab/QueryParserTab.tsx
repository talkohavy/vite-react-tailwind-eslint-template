import { useState } from 'react';
import Input from '../../../../components/controls/Input';
import { QueryLexer, QueryParser } from '../../../../lib/QueryLanguage';

const lexer = new QueryLexer();
const queryParser = new QueryParser();

export default function QueryParserTab() {
  const [query, setQuery] = useState('');

  const tokens = lexer.tokenize(query);
  const result = queryParser.parse(query);

  return (
    <div className='p-6 max-w-4xl mx-auto bg-black'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>Lexer</h1>

        <p className='text-gray-600 mb-6'>Try typing a query below.</p>
      </div>

      <div className='space-y-6'>
        <div className='bg-gray-700 rounded-lg border border-gray-200 p-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-4'>Enter Query</h2>

          <div className='space-y-4'>
            <Input initialValue={query} onChange={setQuery} placeholder='Type a query...' />
          </div>

          <div>
            {result && (
              <div className='my-6 bg-gray-800 rounded-lg p-4'>
                <h3 className='text-lg font-semibold text-gray-200 mb-2'>Parse Result:</h3>
                <pre className='text-gray-100 text-sm overflow-x-auto whitespace-pre-wrap'>
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div>
            {tokens.map((token, index) => {
              const { type, value, position } = token;

              return (
                <div key={index}>
                  type: {type} , value: {value} , position: {position.start}-{position.end}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
