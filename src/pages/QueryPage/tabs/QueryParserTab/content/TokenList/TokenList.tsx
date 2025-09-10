import type { Token } from '../../../../../../lib/QueryLanguage/QueryLexer';

type TokenListProps = {
  tokens: Token[];
};

export default function TokenList(props: TokenListProps) {
  const { tokens } = props;

  return (
    <div className='bg-gray-700 rounded-lg border border-gray-200 p-6'>
      <h2 className='text-xl font-semibold text-gray-900 mb-4'>Tokens</h2>

      <div className='space-y-2'>
        {tokens.map((token, index) => {
          const { type, value, position } = token;

          return (
            <div key={index} className='flex items-center space-x-4 bg-gray-800 p-3 rounded'>
              <span className='text-blue-400 font-mono text-sm'>{type}</span>
              <span className='text-green-400 font-mono text-sm'>"{value}"</span>
              <span className='text-gray-400 text-sm'>
                {position.start}-{position.end}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
