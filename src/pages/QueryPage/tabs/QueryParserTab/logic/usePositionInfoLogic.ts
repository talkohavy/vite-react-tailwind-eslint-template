import { useMemo } from 'react';
import type { Token } from '../../../../../lib/QueryLanguage';
import type { ParseResult } from '../../../../../lib/QueryLanguage/QueryParser';
import type { IQueryParser } from '../../../../../lib/QueryLanguage/QueryParser/QueryParser.interface';
import { ASTBuilder } from '../../../../../lib/QueryLanguage/ASTBuilder';

type UsePositionInfoLogicProps = {
  cursorPosition?: number;
  tokens: Token[];
  result: ParseResult;
  query: string;
  queryParser: IQueryParser;
};

export function usePositionInfoLogic(props: UsePositionInfoLogicProps) {
  const { cursorPosition = 0, tokens, result, query, queryParser } = props;

  const currentToken = useMemo(() => {
    return (
      tokens.find((token) => cursorPosition >= token.position.start && cursorPosition <= token.position.end) || null
    );
  }, [tokens, cursorPosition]);

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

  // Classify whitespace context
  const whitespaceContext = useMemo(() => {
    return queryParser.classifyWhitespace(tokens, cursorPosition);
  }, [query, cursorPosition]);

  return { currentToken, currentASTNode, whitespaceContext };
}
