import { useState, useMemo } from 'react';
import QueryVisualization from '../../../../components/QueryVisualization';
import { QueryLexer, QueryParser } from '../../../../lib/QueryLanguage';
import CursorPositionInfo from './content/CursorPositionInfo';
import QueryInput from './QueryInput';

const lexer = new QueryLexer();
const queryParser = new QueryParser();

export default function QueryParserTab() {
  const [query, setQuery] = useState('status: active AND role: admin');
  const [cursorPosition, setCursorPosition] = useState(0);

  const tokens = lexer.tokenize(query);
  const result = queryParser.parse(query);

  // Find current token based on cursor position
  const currentToken = useMemo(() => {
    return (
      tokens.find((token) => cursorPosition >= token.position.start && cursorPosition <= token.position.end) || null
    );
  }, [tokens, cursorPosition]);

  // Find current AST node based on cursor position
  const currentASTNode = useMemo(() => {
    if (!result.success || !result.ast) return null;

    // This is a simplified version - you could make this more sophisticated
    // to find the deepest/most specific AST node
    function findNodeAtPosition(expression: any, position: number): any {
      if (position >= expression.position.start && position <= expression.position.end) {
        // Check if this node has children
        if (expression.type === 'boolean') {
          const leftMatch = findNodeAtPosition(expression.left, position);
          if (leftMatch) return leftMatch;

          if (
            expression.operator &&
            position >= expression.operator.position.start &&
            position <= expression.operator.position.end
          ) {
            return expression.operator;
          }

          const rightMatch = findNodeAtPosition(expression.right, position);
          if (rightMatch) return rightMatch;
        }

        if (expression.type === 'condition') {
          if (position >= expression.key.position.start && position <= expression.key.position.end) {
            return expression.key;
          }
          if (position >= expression.comparator.position.start && position <= expression.comparator.position.end) {
            return expression.comparator;
          }
          if (position >= expression.value.position.start && position <= expression.value.position.end) {
            return expression.value;
          }
        }

        if (expression.type === 'query' || expression.type === 'group') {
          const childMatch = findNodeAtPosition(expression.expression, position);
          if (childMatch) return childMatch;
        }

        return expression;
      }
      return null;
    }

    return findNodeAtPosition(result.ast, cursorPosition);
  }, [result, cursorPosition]);

  function handleInputChange(newQuery: string, newCursorPosition?: number) {
    setQuery(newQuery);
    if (newCursorPosition !== undefined) {
      setCursorPosition(newCursorPosition);
    }
  }

  return (
    <div className='p-6 max-w-6xl mx-auto bg-black'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>Query Parser Visualization</h1>

        <p className='text-gray-600 mb-6'>Try typing a query below to see how it gets parsed and visualized.</p>
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
            />
          </div>
        </div>

        {/* Gantt Chart Visualization */}
        {query && <QueryVisualization query={query} tokens={tokens} parseResult={result} />}

        {/* Raw Parse Result */}
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

        {/* Token List */}
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
      </div>
    </div>
  );
}
