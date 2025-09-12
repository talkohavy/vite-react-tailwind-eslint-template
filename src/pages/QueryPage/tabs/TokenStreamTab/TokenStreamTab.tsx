import { useState } from 'react';
import Input from '../../../../components/controls/Input';
import { QueryLexer } from '../../../../lib/QueryLanguage/QueryLexer';
import { TokenStream } from '../../../../lib/QueryLanguage/TokenStream';

const lexer = new QueryLexer();

export default function TokenStreamTab() {
  const [query, setQuery] = useState('');

  const tokens = lexer.tokenize(query);

  const tokenStream = new TokenStream(tokens);

  console.log('tokenStream is:', tokenStream);

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
