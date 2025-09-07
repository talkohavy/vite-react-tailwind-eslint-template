/**
 * AST-Based Context Analyzer for Auto-Completion
 *
 * This module analyzes the current context by traversing the AST (parseResult)
 * and determining what type of completions should be offered based on the
 * cursor position within the syntax tree.
 */

import type {
  ASTNode,
  BooleanExpression,
  ConditionExpression,
  Expression,
  GroupExpression,
  QueryExpression,
} from '../ASTBuilder/types';
import type { ParseError, ParseResult } from '../QueryParser/types';
import type { CompletionContext, Token } from '../types';
import type { AnalyzeContextProps, ASTContextInfo } from './ASTContextAnalyzer.interface';
import { ExpressionTypes } from '../ASTBuilder/logic/constants';
import { TokenTypes } from '../QueryLexer/logic/constants';
import { ContextTypes, type ContextTypeValues } from '../QueryParser/logic/constants';
import { AstTypes } from '../utils';
import { CursorPosition, type CursorPositionValues } from './logic/constants';

export class ASTContextAnalyzer {
  constructor(private readonly tokens: Token[]) {}

  /**
   * Analyzes the completion context at a given cursor position using AST traversal
   */
  public analyzeContext(props: AnalyzeContextProps): CompletionContext {
    const { parseResult, cursorPosition, originalQuery } = props;

    const currentTokenIndex = this.findTokenAtPosition(cursorPosition);
    const currentToken = this.tokens[currentTokenIndex];

    // Check if we're in quotes
    const isInQuotes = this.isPositionInQuotes(currentToken);

    // Extract incomplete value being typed
    const incompleteValue = this.extractIncompleteValue(originalQuery, cursorPosition);

    // Get syntax errors
    const syntaxErrors = this.getSyntaxErrors(parseResult);

    // Determine expected types by traversing the AST
    const expectedTypes = this.determineExpectedTypesFromAST(
      parseResult,
      cursorPosition,
      currentToken,
      syntaxErrors.length > 0,
    );

    // Determine various insertion capabilities
    const canInsertLogicalOperator = this.canInsertLogicalOperator(expectedTypes);
    const canInsertComparator = this.canInsertComparator(expectedTypes);
    const canInsertKey = this.canInsertKey(expectedTypes);
    const canInsertValue = this.canInsertValue(expectedTypes);
    const canStartNewGroup = this.canStartNewGroup(expectedTypes);

    // Check if query is partially correct up to cursor position
    const isPartiallyCorrect = this.isQueryCorrectUpToPosition(cursorPosition, parseResult);

    const context: CompletionContext = {
      cursorPosition,
      currentToken,
      expectedTypes,
      isInQuotes,
      isPartiallyCorrect,
      canInsertLogicalOperator,
      canInsertComparator,
      canInsertKey,
      canInsertValue,
      canStartNewGroup,
      incompleteValue,
      syntaxErrors,
    };

    return context;
  }

  /**
   * Determines expected types by analyzing the AST structure
   */
  private determineExpectedTypesFromAST(
    parseResult: ParseResult,
    cursorPosition: number,
    currentToken: Token | undefined,
    hasErrors: boolean,
  ): ContextTypeValues[] {
    // If there are parsing errors, we need to be more careful
    if (hasErrors) {
      const expectedTypes = this.determineExpectedTypesFromErrors(parseResult, cursorPosition, currentToken);
      return expectedTypes;
    }

    // If no AST was generated, we're at the beginning or in an invalid state
    if (!parseResult.ast) {
      const expectedTypes = this.determineExpectedTypesForEmptyQuery(cursorPosition);

      return expectedTypes;
    }

    // Traverse the AST to find where the cursor is positioned
    const astNodes = this.findAstNodeByCursor(parseResult.ast, cursorPosition);
    const positionType = this.getPositionTypeFromContext(astNodes.node, astNodes.parentNode);
    const expectedTypes = this.getExpectedTypesForCondition(positionType);

    return expectedTypes;
  }

  /**
   * Determines expected types when there are parsing errors
   */
  private determineExpectedTypesFromErrors(
    parseResult: ParseResult,
    cursorPosition: number,
    _currentToken: Token | undefined,
  ): ContextTypeValues[] {
    const relevantErrors = parseResult.errors.filter(
      (error: ParseError) => error.position.start <= cursorPosition && cursorPosition <= error.position.end,
    );

    if (relevantErrors.length === 0) {
      // No errors at cursor position, try to determine from partial AST
      if (parseResult.ast) {
        const astNodes = this.findAstNodeByCursor(parseResult.ast, cursorPosition);

        console.log('astNodes is:', astNodes);

        const positionType = this.getPositionTypeFromContext(astNodes.node, astNodes.parentNode);
        const expectedTypes = this.getExpectedTypesForCondition(positionType);

        return expectedTypes;
      }

      const expectedTypes = this.determineExpectedTypesForEmptyQuery(cursorPosition);

      return expectedTypes;
    }

    if (relevantErrors[0]?.expectedTokens) {
      return relevantErrors[0].expectedTokens;
    }

    // If there's a complete expression before the error position, suggest logical operators
    if (parseResult.ast && this.doesQueryHaveCompleteExpression(parseResult.ast)) {
      return [ContextTypes.LogicalOperator, ContextTypes.RightParenthesis];
    }

    // Analyze the most relevant error
    const primaryError = relevantErrors[0]!;

    if (primaryError.expectedTokens) {
      const expectedTypes = this.mapExpectedTokensToContextTypes(primaryError.expectedTokens);
      return expectedTypes;
    }

    // Fallback: try to infer from the error message and position
    const expectedTypes = this.inferExpectedTypesFromErrorMessage(primaryError);
    return expectedTypes;
  }

  /**
   * Determines expected types for an empty query
   */
  private determineExpectedTypesForEmptyQuery(cursorPosition: number): ContextTypeValues[] {
    // At the beginning of a query, we expect a key or opening parenthesis
    if (cursorPosition === 0) {
      return [ContextTypes.Key, ContextTypes.LeftParenthesis];
    }

    // Default fallback
    return [];
  }

  /**
   * Finds the context within the AST where the cursor is positioned
   */
  private findAstNodeByCursor(ast: ASTNode, cursorPosition: number): ASTContextInfo {
    let mostSpecificNode: ASTNode | null = null;
    let mostSpecificParent: ASTNode | null = null;

    const updateMostSpecificNode = (node: ASTNode, parent: ASTNode | null): boolean => {
      /**
       * NODE: this is to include the edge case of whitespaces after value
       */
      const nodeToCheck = {
        ...node,
        type: node.type,
        position: {
          ...node.position,
          end: node.position.end + ((parent as any)?.spacesAfterValue ?? 0),
        },
      };

      const isWithinNode = this.isPositionWithinNode(cursorPosition, nodeToCheck);

      let shouldContinueDrillDown = false;

      if (isWithinNode) {
        // This node contains the cursor position
        // Keep track of the most specific (smallest) node that contains the cursor
        if (!mostSpecificNode || this.isMoreSpecific(node, mostSpecificNode)) {
          mostSpecificNode = node;
          mostSpecificParent = parent;
        }

        shouldContinueDrillDown = true;
      }

      return shouldContinueDrillDown;
    };

    this.traverseAST(ast, null, updateMostSpecificNode);

    const astNodes: ASTContextInfo = {
      node: mostSpecificNode,
      parentNode: mostSpecificParent,
    };

    return astNodes;
  }

  /**
   * Determines if nodeA is more specific than nodeB (has a smaller range)
   */
  private isMoreSpecific(nodeA: ASTNode, nodeB: ASTNode): boolean {
    const rangeA = nodeA.position.end - nodeA.position.start;
    const rangeB = nodeB.position.end - nodeB.position.start;

    // Prefer smaller ranges (more specific)
    if (rangeA !== rangeB) {
      return rangeA < rangeB;
    }

    // If ranges are equal, prefer condition nodes over query nodes
    if (nodeA.type === AstTypes.Condition && nodeB.type === AstTypes.Query) {
      return true;
    }

    return false;
  }

  /**
   * Traverses the AST and calls a callback for each node
   */
  private traverseAST(
    node: ASTNode,
    parent: ASTNode | null,
    callback: (node: ASTNode, parent: ASTNode | null) => boolean,
  ): void {
    const shouldContinueDrillDown = callback(node, parent);

    if (!shouldContinueDrillDown) return;

    switch (node.type) {
      case AstTypes.Query: {
        const queryNode = node as QueryExpression;
        this.traverseAST(queryNode.expression, node, callback);

        break;
      }

      case AstTypes.Boolean: {
        const booleanNode = node as BooleanExpression;
        this.traverseAST(booleanNode.left, node, callback);
        this.traverseAST(booleanNode.right, node, callback);

        break;
      }

      case AstTypes.Group: {
        const groupNode = node as GroupExpression;
        this.traverseAST(groupNode.expression, node, callback);

        break;
      }

      case AstTypes.Condition: {
        const conditionNode = node as ConditionExpression;
        this.traverseAST(conditionNode.key, node, callback);
        this.traverseAST(conditionNode.comparator, node, callback);
        this.traverseAST(conditionNode.value, node, callback);

        break;
      }

      default: {
        // Key/Value/Comparator nodes are leaf nodes, no children to traverse
      }
    }
  }

  /**
   * Checks if a position is within a given AST node
   */
  private isPositionWithinNode(position: number, node: ASTNode): boolean {
    const isWithinNode = node.position.start <= position && position <= node.position.end;

    return isWithinNode;
  }

  /**
   * Checks if the query has a complete expression that can be extended
   */
  private doesQueryHaveCompleteExpression(queryNode: Expression): boolean {
    if (!('expression' in queryNode)) return false;

    const expression = queryNode.expression;

    // Check if we have a complete condition
    if (expression.type === ExpressionTypes.Condition) {
      const conditionExpression = expression as ConditionExpression;
      return !!(conditionExpression.key && conditionExpression.comparator && conditionExpression.value);
    }

    // Check if we have a complete boolean expression
    if (expression.type === ExpressionTypes.Boolean) {
      const booleanExpression = expression as BooleanExpression;
      return !!(booleanExpression.left && booleanExpression.right);
    }

    // Check if we have a complete group
    if (expression.type === ExpressionTypes.Group) {
      const groupExpression = expression as GroupExpression;
      return groupExpression.expression && this.doesQueryHaveCompleteExpression(groupExpression);
    }

    return false;
  }

  /**
   * Gets expected types when cursor is within a condition expression
   */
  private getExpectedTypesForCondition(position: CursorPositionValues): ContextTypeValues[] {
    switch (position) {
      case CursorPosition.InKey:
        return [ContextTypes.Key];

      case CursorPosition.InOperator:
        return [ContextTypes.Comparator];

      case CursorPosition.InValue:
        return [ContextTypes.Value, ContextTypes.QuotedString];

      case CursorPosition.AfterValue:
        return [ContextTypes.LogicalOperator, ContextTypes.RightParenthesis];

      case CursorPosition.BetweenKeyComparator:
        return [ContextTypes.Comparator];

      case CursorPosition.BetweenComparatorValue:
        return [ContextTypes.Value];

      default:
        return [];
    }
  }

  /**
   * Maps expected tokens from parse errors to context types
   */
  private mapExpectedTokensToContextTypes(expectedTokens: string[]): ContextTypeValues[] {
    const contextTypes: ContextTypeValues[] = [];

    expectedTokens.forEach((tokenType) => {
      switch (tokenType) {
        case TokenTypes.Key:
          contextTypes.push(ContextTypes.Key);
          break;
        case TokenTypes.Value:
          contextTypes.push(ContextTypes.Value);
          break;
        case TokenTypes.Identifier:
          // Fallback for any remaining IDENTIFIER tokens (should be rare now)
          contextTypes.push(ContextTypes.Key, ContextTypes.Value);
          break;
        case TokenTypes.AND:
        case TokenTypes.OR:
          contextTypes.push(ContextTypes.LogicalOperator);
          break;
        case TokenTypes.Comparator:
        case TokenTypes.Colon:
          contextTypes.push(ContextTypes.Comparator);
          break;
        case TokenTypes.LeftParenthesis:
          contextTypes.push(ContextTypes.LeftParenthesis);
          break;
        case TokenTypes.RightParenthesis:
          contextTypes.push(ContextTypes.RightParenthesis);
          break;
        case TokenTypes.QuotedString:
          contextTypes.push(ContextTypes.Value);
          break;
      }
    });

    // Remove duplicates
    return Array.from(new Set(contextTypes));
  } /**
   * Infers expected types from error message when expectedTokens is not available
   */
  private inferExpectedTypesFromErrorMessage(error: ParseError): ContextTypeValues[] {
    const message = error.message.toLowerCase();

    // Special case: empty query should suggest keys and parentheses
    if (message.includes('empty query')) {
      return [ContextTypes.Key, ContextTypes.LeftParenthesis];
    }

    if (message.includes('expected identifier') || message.includes('expected key')) {
      return [ContextTypes.Key];
    }

    if (message.includes('expected value')) {
      return [ContextTypes.Value];
    }

    if (message.includes('expected operator') || message.includes('expected and') || message.includes('expected or')) {
      return [ContextTypes.LogicalOperator];
    }

    if (message.includes('expected comparator') || message.includes('expected colon')) {
      return [ContextTypes.Comparator];
    }

    // Default fallback
    return [ContextTypes.Key];
  }

  /**
   * Finds the token at or before the given position
   */
  private findTokenAtPosition(position: number): number {
    for (let i = 0; i < this.tokens.length; i++) {
      const token = this.tokens[i]!;

      if (token.position.start <= position && position <= token.position.end) {
        return i;
      }

      if (token.position.start > position) {
        return Math.max(0, i - 1);
      }
    }

    return Math.max(0, this.tokens.length - 1);
  }

  /**
   * Checks if the cursor position is within quotes
   */
  private isPositionInQuotes(currentToken: Token | undefined): boolean {
    return currentToken?.type === TokenTypes.QuotedString;
  }

  /**
   * Extracts incomplete value being typed
   */
  private extractIncompleteValue(query: string, position: number): string {
    if (query.length === 0) return '';

    const beforeCursor = query.substring(0, position);
    const afterCursor = query.substring(position);

    // Find the start of the current word (including comparator characters)
    let start = position - 1;
    while (start >= 0) {
      const char = beforeCursor[start];
      if (char && /[\w=!<>~]/.test(char)) {
        start--;
      } else {
        break;
      }
    }
    start++;

    // Find the end of the current word (including comparator characters)
    let end = 0;
    while (end < afterCursor.length) {
      const char = afterCursor[end];
      if (char && /[\w=!<>~]/.test(char)) {
        end++;
      } else {
        break;
      }
    }

    const incompleteValue = beforeCursor.substring(start) + afterCursor.substring(0, end);
    return incompleteValue;
  }

  /**
   * Gets syntax errors from parsing the query
   */
  private getSyntaxErrors(parseResult: ParseResult): string[] {
    return parseResult.errors.map((error: ParseError) => error.message);
  }

  /**
   * Checks if the query is correct up to the given position
   */
  private isQueryCorrectUpToPosition(position: number, parseResult: ParseResult): boolean {
    return parseResult.errors.every((error: ParseError) => error.position.start > position);
  }

  /**
   * Determines if logical operators can be inserted
   */
  private canInsertLogicalOperator(expectedTypes: ContextTypeValues[]): boolean {
    return expectedTypes.includes(ContextTypes.LogicalOperator);
  }

  /**
   * Determines if comparators can be inserted
   */
  private canInsertComparator(expectedTypes: ContextTypeValues[]): boolean {
    return expectedTypes.includes(ContextTypes.Comparator);
  }

  /**
   * Determines if values can be inserted
   */
  private canInsertValue(expectedTypes: ContextTypeValues[]): boolean {
    return expectedTypes.includes(ContextTypes.Value);
  }

  /**
   * Determines if keys can be inserted
   */
  private canInsertKey(expectedTypes: ContextTypeValues[]): boolean {
    return expectedTypes.includes(ContextTypes.Key);
  }

  /**
   * Determines if new groups can be started
   */
  private canStartNewGroup(expectedTypes: ContextTypeValues[]): boolean {
    return expectedTypes.includes(ContextTypes.LeftParenthesis);
  }

  private getPositionTypeFromContext(node: ASTNode | null, _parentNode: ASTNode | null) {
    if (!node) {
      return CursorPosition.Unknown;
    }

    if (node.type === AstTypes.Key) {
      return CursorPosition.InKey;
    }

    if (node.type === AstTypes.Value) {
      return CursorPosition.InValue;
    }

    if (node.type === AstTypes.Comparator) {
      return CursorPosition.InComparator;
    }

    return CursorPosition.Unknown;
  }
}
