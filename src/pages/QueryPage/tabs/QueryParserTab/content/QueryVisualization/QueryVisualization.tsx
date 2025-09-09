import { useMemo } from 'react';
import type { ParseResult } from '../../../../../../lib/QueryLanguage/QueryParser/types';
import type { VisualizationItem } from './types';
import Gantt from './content/Gantt';
import OriginalQueryDisplayer from './content/OriginalQueryDisplayer';
import ParseErrorDisplayer from './content/ParseErrorDisplayer';
import { TOKEN_COLORS } from './logic/constants';
import { extractASTNodes } from './logic/utils/extractASTNodes';

interface QueryVisualizationProps {
  query: string;
  parseResult: ParseResult;
}

export default function QueryVisualization(props: QueryVisualizationProps) {
  const { query, parseResult } = props;

  const visualizationData = useMemo(() => {
    const items: VisualizationItem[] = [];

    parseResult.tokens.forEach((token, index) => {
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
  }, [parseResult.tokens, parseResult]);

  const maxLevel = Math.max(...visualizationData.map((item) => item.level));
  const queryLength = query.length;

  return (
    <div className='bg-gray-900 rounded-lg p-6 text-white'>
      <h3 className='text-xl font-bold mb-4'>Query Parse Visualization</h3>

      <OriginalQueryDisplayer query={query} />

      <Gantt maxLevel={maxLevel} visualizationData={visualizationData} queryLength={queryLength} />

      {parseResult.errors.length > 0 && <ParseErrorDisplayer errors={parseResult.errors} />}
    </div>
  );
}
