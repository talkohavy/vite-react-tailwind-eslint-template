import { useMemo } from 'react';
import { ASTBuilder, type ParseResult } from 'create-query-language';

type UsePositionInfoLogicProps = {
  cursorPosition?: number;
  result: ParseResult;
};

export function usePositionInfoLogic(props: UsePositionInfoLogicProps) {
  const { cursorPosition = 0, result } = props;

  const currentToken = useMemo(() => {
    return (
      result.tokens.find((token) => cursorPosition >= token.position.start && cursorPosition <= token.position.end) ||
      null
    );
  }, [result.tokens, cursorPosition]);

  // Find current AST node based on cursor position
  const currentASTNode = useMemo(() => {
    if (!result.success || !result.ast) return null;

    let foundNode: any = null;

    // Use ASTBuilder's traverseAST method instead of our own recursive function
    ASTBuilder.traverseAST(result.ast, null, (node: any, _parent: any): boolean => {
      // Check if cursor position is within this node
      if (cursorPosition >= node.position.start && cursorPosition <= node.position.end) {
        // Update the found node if this one is more specific (smaller range)
        if (!foundNode || node.position.end - node.position.start < foundNode.position.end - foundNode.position.start) {
          foundNode = node;
        }
        // Continue drilling down to find more specific nodes
        return true;
      }
      // Don't drill down into nodes that don't contain the cursor
      return false;
    });

    return foundNode;
  }, [result, cursorPosition]);

  return { currentToken, currentASTNode };
}
