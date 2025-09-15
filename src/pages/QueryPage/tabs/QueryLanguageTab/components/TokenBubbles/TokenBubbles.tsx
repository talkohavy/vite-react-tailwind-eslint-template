import { useMemo } from 'react';
import clsx from 'clsx';
import { type Token, TokenTypes } from 'create-query-language';
import { ERROR_TOKEN_CLASS, TOKEN_COLOR_MAP } from './logic/constants';
import TokenLegend from './TokenLegend/TokenLegend';

type TokenBubblesProps = {
  tokens: Token[];
  firstErrorTokenIndex?: number;
};

export default function TokenBubbles(props: TokenBubblesProps) {
  const { tokens, firstErrorTokenIndex } = props;

  const filteredTokens = tokens.filter((token) => ![TokenTypes.Whitespace, TokenTypes.EOF].includes(token.type as any));

  const { validTokens, errorTokens } = useMemo(() => {
    if (firstErrorTokenIndex == null) {
      return { validTokens: filteredTokens, errorTokens: [] };
    }

    const validTokens: Token[] = [];
    const errorTokens: Token[] = [];

    filteredTokens.forEach((token, index) => {
      if (token.type === TokenTypes.EOF) return;

      if (index < firstErrorTokenIndex) {
        validTokens.push(token);
      } else {
        if (errorTokens.length === 0) {
          errorTokens.push(token);
        }
      }
    });

    return { validTokens, errorTokens };
  }, [tokens]);

  return (
    <div className='mt-4'>
      <h3 className='text-sm font-medium text-gray-300 mb-2'>Query Tokens</h3>

      <div className='flex gap-2 items-center overflow-auto'>
        {validTokens.map((token, index) => {
          const colorClass = TOKEN_COLOR_MAP[token.type] || 'bg-gray-100 text-gray-800 border-gray-200';

          return (
            <span
              key={`${token.position.start}-${token.position.end}-${index}`}
              className={clsx(
                'inline-flex items-center h-8 px-2.5 py-1 rounded-lg text-xs font-medium border',
                colorClass,
              )}
              title={`Type: ${token.type}, Position: ${token.position.start}-${token.position.end}`}
            >
              <span className='select-none'>{token.value}</span>
            </span>
          );
        })}

        {errorTokens.map((token, index) => {
          const colorClass = ERROR_TOKEN_CLASS;

          return (
            <span
              key={`${token.position.start}-${token.position.end}-${index}`}
              className={clsx(
                'inline-flex items-center h-8 px-2.5 py-1 rounded-lg text-xs font-medium border',
                colorClass,
              )}
              title={`Type: ${token.type}, Position: ${token.position.start}-${token.position.end}(Error detected)`}
            >
              <span className='select-none'>{token.value}</span>

              <svg className='ml-1 w-3 h-3' fill='currentColor' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                  clipRule='evenodd'
                />
              </svg>
            </span>
          );
        })}

        {validTokens.length > 0 && (
          <div className='ml-auto text-xs text-gray-400'>
            {validTokens.length} token{validTokens.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <TokenLegend />
    </div>
  );
}
