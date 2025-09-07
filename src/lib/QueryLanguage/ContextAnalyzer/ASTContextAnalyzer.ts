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
  GroupExpression,
  QueryExpression,
} from '../ASTBuilder/types';
import type { ContextTypeValues } from '../QueryParser/logic/constants';
import type { ParseResult } from '../QueryParser/types';
import type { CompletionContext } from '../types';
import type { AnalyzeContextProps, ASTContextInfo } from './ASTContextAnalyzer.interface';
import { AstTypes } from '../utils';

export class ASTContextAnalyzer {
  constructor() {}

  /**
   * Analyzes the completion context at a given cursor position using AST traversal
   */
  public analyzeContext(props: AnalyzeContextProps): CompletionContext {
    const { parseResult, cursorPosition, originalQuery } = props;

    // Extract incomplete value being typed
    const incompleteValue = this.extractIncompleteValue(originalQuery, cursorPosition);

    // Determine expected types by traversing the AST
    const expectedTypes = this.determineExpectedTypesFromAST(parseResult, cursorPosition);

    // Check if query is partially correct up to cursor position

    const context: CompletionContext = {
      cursorPosition,
      expectedTypes,
      incompleteValue,
    };

    return context;
  }

  /**
   * Determines expected types by analyzing the AST structure
   */
  private determineExpectedTypesFromAST(parseResult: ParseResult, cursorPosition: number): ContextTypeValues[] {
    // Traverse the AST to find where the cursor is positioned
    const astNodes = this.findAstNodeByCursor(parseResult.ast!, cursorPosition);

    // INSERT LOGIC HERE TO DETERMINE EXPECTED TYPES BASED ON astNodes.node AND astNodes.parentNode
    // For simplicity, we'll return a placeholder value for now

    return astNodes as any;
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
}
