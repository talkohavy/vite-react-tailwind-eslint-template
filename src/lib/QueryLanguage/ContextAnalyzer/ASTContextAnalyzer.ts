/**
 * AST-Based Context Analyzer for Auto-Completion
 *
 * This module analyzes the current context by traversing the AST (parseResult)
 * and determining what type of completions should be offered based on the
 * cursor position within the syntax tree.
 */

import type { CompletionContext, ParseResult, Token, ASTNode, ParseError } from '../types';
import type { AnalyzeContextProps } from './ASTContextAnalyzer.interface';
import { TokenTypes } from '../QueryLexer/logic/constants';
import { ContextTypes, type ContextTypeValues } from './logic/constants';

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
      return this.determineExpectedTypesFromErrors(parseResult, cursorPosition, currentToken);
    }

    // If no AST was generated, we're at the beginning or in an invalid state
    if (!parseResult.ast) {
      return this.determineExpectedTypesForEmptyQuery(cursorPosition);
    }

    // Traverse the AST to find where the cursor is positioned
    const contextInfo = this.findCursorContextInAST(parseResult.ast, cursorPosition);

    return this.mapASTContextToExpectedTypes(contextInfo, currentToken);
  }

  /**
   * Determines expected types when there are parsing errors
   */
  private determineExpectedTypesFromErrors(
    parseResult: ParseResult,
    cursorPosition: number,
    currentToken: Token | undefined,
  ): ContextTypeValues[] {
    const relevantErrors = parseResult.errors.filter(
      (error) => error.position.start <= cursorPosition && cursorPosition <= error.position.end,
    );

    if (relevantErrors.length === 0) {
      // No errors at cursor position, try to determine from partial AST
      if (parseResult.ast) {
        const contextInfo = this.findCursorContextInAST(parseResult.ast, cursorPosition);
        return this.mapASTContextToExpectedTypes(contextInfo, currentToken);
      }
      return this.determineExpectedTypesForEmptyQuery(cursorPosition);
    }

    // Analyze the most relevant error
    const primaryError = relevantErrors[0]!;

    if (primaryError.expectedTokens) {
      return this.mapExpectedTokensToContextTypes(primaryError.expectedTokens, currentToken);
    }

    // Fallback: try to infer from the error message and position
    return this.inferExpectedTypesFromErrorMessage(primaryError, currentToken);
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
    return [ContextTypes.Key];
  }

  /**
   * Finds the context within the AST where the cursor is positioned
   */
  private findCursorContextInAST(ast: ASTNode, cursorPosition: number): ASTContextInfo {
    const context: ASTContextInfo = {
      type: 'unknown',
      node: null,
      parentNode: null,
      position: 'unknown',
    };

    this.traverseAST(ast, null, (node, parent) => {
      if (this.isPositionWithinNode(cursorPosition, node)) {
        context.node = node;
        context.parentNode = parent;
        context.type = this.determineNodeContext(node);
        context.position = this.determinePositionInNode(node, cursorPosition);
        return false; // Continue traversing to find the most specific node
      }
      return true;
    });

    return context;
  }

  /**
   * Traverses the AST and calls a callback for each node
   */
  private traverseAST(
    node: ASTNode,
    parent: ASTNode | null,
    callback: (node: ASTNode, parent: ASTNode | null) => boolean,
  ): void {
    if (!callback(node, parent)) {
      return;
    }

    switch (node.type) {
      case 'query': {
        const queryNode = node as any;
        if (queryNode.expression) {
          this.traverseAST(queryNode.expression, node, callback);
        }
        break;
      }

      case 'boolean': {
        const booleanNode = node as any;
        if (booleanNode.left) {
          this.traverseAST(booleanNode.left, node, callback);
        }
        if (booleanNode.right) {
          this.traverseAST(booleanNode.right, node, callback);
        }
        break;
      }

      case 'group': {
        const groupNode = node as any;
        if (groupNode.expression) {
          this.traverseAST(groupNode.expression, node, callback);
        }
        break;
      }

      case 'condition':
        // Condition nodes are leaf nodes, no children to traverse
        break;
    }
  }

  /**
   * Checks if a position is within a given AST node
   */
  private isPositionWithinNode(position: number, node: ASTNode): boolean {
    return node.position.start <= position && position <= node.position.end;
  }

  /**
   * Determines the type of context based on the AST node
   */
  private determineNodeContext(node: ASTNode): string {
    switch (node.type) {
      case 'query':
        return 'query-root';
      case 'boolean':
        return 'boolean-expression';
      case 'condition':
        return 'condition-expression';
      case 'group':
        return 'group-expression';
      default:
        return 'unknown';
    }
  }

  /**
   * Determines where within a node the cursor is positioned
   */
  private determinePositionInNode(node: ASTNode, cursorPosition: number): string {
    const nodeLength = node.position.end - node.position.start;
    const relativePosition = cursorPosition - node.position.start;
    const normalizedPosition = relativePosition / nodeLength;

    if (normalizedPosition < 0.33) {
      return 'start';
    }
    if (normalizedPosition > 0.67) {
      return 'end';
    }
    return 'middle';
  }

  /**
   * Maps AST context information to expected completion types
   */
  private mapASTContextToExpectedTypes(
    contextInfo: ASTContextInfo,
    currentToken: Token | undefined,
  ): ContextTypeValues[] {
    const { type, position, node } = contextInfo;

    switch (type) {
      case 'query-root':
        return [ContextTypes.Key, ContextTypes.LeftParenthesis];

      case 'condition-expression':
        return this.getExpectedTypesForCondition(node as any, position, currentToken);

      case 'boolean-expression':
        return this.getExpectedTypesForBoolean(node as any, position);

      case 'group-expression':
        return this.getExpectedTypesForGroup(node as any, position);

      default:
        return [ContextTypes.Key];
    }
  }

  /**
   * Gets expected types when cursor is within a condition expression
   */
  private getExpectedTypesForCondition(
    node: any,
    position: string,
    currentToken: Token | undefined,
  ): ContextTypeValues[] {
    // Handle partial matching for the current token
    if (currentToken) {
      const partialValue = currentToken.value.toLowerCase();

      // Check for partial logical operators
      if (this.isPartialLogicalOperator(partialValue)) {
        return [ContextTypes.LogicalOperator];
      }

      // Check for partial comparators
      if (this.isPartialComparator(partialValue)) {
        return [ContextTypes.Comparator];
      }
    }

    switch (position) {
      case 'start':
        return [ContextTypes.Key];
      case 'middle':
        // Could be in key, comparator, or value
        if (node.key && !node.comparator) {
          return [ContextTypes.Comparator];
        }
        if (node.comparator && !node.value) {
          return [ContextTypes.Value];
        }
        return [ContextTypes.Key, ContextTypes.Comparator, ContextTypes.Value];
      case 'end':
        if (node.value) {
          return [ContextTypes.LogicalOperator, ContextTypes.RightParenthesis];
        }
        return [ContextTypes.Value];
      default:
        return [ContextTypes.Key];
    }
  }

  /**
   * Gets expected types when cursor is within a boolean expression
   */
  private getExpectedTypesForBoolean(_node: any, position: string): ContextTypeValues[] {
    switch (position) {
      case 'start':
        return [ContextTypes.Key, ContextTypes.LeftParenthesis];
      case 'middle':
        return [ContextTypes.LogicalOperator];
      case 'end':
        return [ContextTypes.Key, ContextTypes.LeftParenthesis];
      default:
        return [ContextTypes.LogicalOperator];
    }
  }

  /**
   * Gets expected types when cursor is within a group expression
   */
  private getExpectedTypesForGroup(_node: any, position: string): ContextTypeValues[] {
    switch (position) {
      case 'start':
        return [ContextTypes.Key, ContextTypes.LeftParenthesis];
      case 'end':
        return [ContextTypes.RightParenthesis, ContextTypes.LogicalOperator];
      default:
        return [ContextTypes.Key, ContextTypes.LeftParenthesis];
    }
  }

  /**
   * Maps expected tokens from parse errors to context types
   */
  private mapExpectedTokensToContextTypes(
    expectedTokens: string[],
    _currentToken: Token | undefined,
  ): ContextTypeValues[] {
    const contextTypes: ContextTypeValues[] = [];

    expectedTokens.forEach((tokenType) => {
      switch (tokenType) {
        case TokenTypes.Identifier:
          // Could be key or value depending on context
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
  }

  /**
   * Infers expected types from error message when expectedTokens is not available
   */
  private inferExpectedTypesFromErrorMessage(error: ParseError, _currentToken: Token | undefined): ContextTypeValues[] {
    const message = error.message.toLowerCase();

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
   * Checks if a partial value could be a logical operator
   */
  private isPartialLogicalOperator(partialValue: string): boolean {
    const operators = ['and', 'or'];
    return operators.some((op) => op.startsWith(partialValue) && partialValue.length < op.length);
  }

  /**
   * Checks if a partial value could be a comparator
   */
  private isPartialComparator(partialValue: string): boolean {
    const comparators = ['==', '!=', '>=', '<=', '~'];
    return comparators.some((comp) => comp.startsWith(partialValue) && partialValue.length < comp.length);
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
    return parseResult.errors.map((error) => error.message);
  }

  /**
   * Checks if the query is correct up to the given position
   */
  private isQueryCorrectUpToPosition(position: number, parseResult: ParseResult): boolean {
    return parseResult.errors.every((error) => error.position.start > position);
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
   * Determines if new groups can be started
   */
  private canStartNewGroup(expectedTypes: ContextTypeValues[]): boolean {
    return expectedTypes.includes(ContextTypes.LeftParenthesis);
  }
}

/**
 * Context information about where the cursor is positioned in the AST
 */
interface ASTContextInfo {
  type: string;
  node: ASTNode | null;
  parentNode: ASTNode | null;
  position: string; // 'start', 'middle', 'end', 'unknown'
}
