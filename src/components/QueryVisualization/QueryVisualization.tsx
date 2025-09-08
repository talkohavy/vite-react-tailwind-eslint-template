import { useMemo } from 'react';
import type { Token } from '../../lib/QueryLanguage';
import type { ParseResult } from '../../lib/QueryLanguage/QueryParser/types';
import type { VisualizationItem } from './types';
import Gantt from './Gantt';
import { TOKEN_COLORS } from './logic/constants';
import { extractASTNodes } from './logic/utils/extractASTNodes';
import OriginalQueryDisplayer from './OriginalQueryDisplayer';

interface QueryVisualizationProps {
  query: string;
  tokens: Token[];
  parseResult: ParseResult;
}

export default function QueryVisualization(props: QueryVisualizationProps) {
  const { query, tokens, parseResult } = props;

  const visualizationData = useMemo(() => {
    const items: VisualizationItem[] = [];

    // Add tokens
    tokens.forEach((token, index) => {
      items.push({
        id: `token-${index}`,
        label: `${token.type}: "${token.value}"`,
        start: token.position.start,
        end: token.position.end,
        type: 'token',
        subType: token.type,
        level: 0,
        color: TOKEN_COLORS[token.type as keyof typeof TOKEN_COLORS] || TOKEN_COLORS.unknown,
      });
    });

    // Add AST nodes if parsing was successful
    if (parseResult.success && parseResult.ast) {
      const astItems = extractASTNodes(parseResult.ast, 1);
      items.push(...astItems);
    }

    return items;
  }, [tokens, parseResult]);

  const maxLevel = Math.max(...visualizationData.map((item) => item.level));
  const queryLength = query.length;

  return (
    <div className='bg-gray-900 rounded-lg p-6 text-white'>
      <h3 className='text-xl font-bold mb-4'>Query Parse Visualization</h3>

      <OriginalQueryDisplayer query={query} />

      <Gantt maxLevel={maxLevel} visualizationData={visualizationData} queryLength={queryLength} />

      {/* Parse Errors */}
      {parseResult.errors.length > 0 && (
        <div className='mt-4 p-4 bg-red-900 border border-red-700 rounded'>
          <h4 className='text-sm font-semibold mb-2 text-red-200'>Parse Errors:</h4>
          <div className='space-y-2'>
            {parseResult.errors.map((error, index) => (
              <div key={index} className='text-sm text-red-300'>
                <div className='font-mono'>
                  Position {error.position.start}-{error.position.end}: {error.message}
                </div>
                {error.expectedTokens && (
                  <div className='text-xs text-red-400 ml-4'>Expected: {error.expectedTokens.join(', ')}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
