import { useState, useMemo } from 'react';
import { QueryLexer, QueryParser } from '../../../../../lib/QueryLanguage';

const lexer = new QueryLexer();
const queryParser = new QueryParser();

export function useQueryParserTabLogic() {
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

  // Classify whitespace context
  const whitespaceContext = useMemo(() => {
    return queryParser.classifyWhitespace(query, cursorPosition);
  }, [query, cursorPosition]);

  function handleInputChange(newQuery: string, newCursorPosition?: number) {
    setQuery(newQuery);
    if (newCursorPosition !== undefined) {
      setCursorPosition(newCursorPosition);
    }
  }

  return {
    query,
    tokens,
    result,
    cursorPosition,
    currentToken,
    currentASTNode,
    whitespaceContext,
    handleInputChange,
  };
}
