/**
 * ASTBuilder - Utility functions for building Abstract Syntax Tree nodes
 *
 * This module provides factory functions for creating well-formed AST nodes
 * with proper type checking and position tracking.
 */

import type {
  QueryExpression,
  BooleanExpression,
  ConditionExpression,
  GroupExpression,
  Expression,
  Position,
  BooleanOperator,
  Comparator,
} from '../types';

export const AstTypes = {
  Query: 'query',
  Boolean: 'boolean',
  Condition: 'condition',
  Group: 'group',
} as const;

type TypOfAstTypes = typeof AstTypes;
export type AstTypeKeys = keyof TypOfAstTypes;
export type AstTypeValues = TypOfAstTypes[AstTypeKeys];

export class ASTBuilder {
  /**
   * Create a query expression (root node)
   */
  static createQuery(expression: Expression, position: Position): QueryExpression {
    return {
      type: AstTypes.Query,
      expression,
      position,
    };
  }

  /**
   * Create a boolean expression (AND/OR operations)
   */
  static createBooleanExpression(
    operator: BooleanOperator,
    left: Expression,
    right: Expression,
    position: Position,
  ): BooleanExpression {
    return {
      type: AstTypes.Boolean,
      operator,
      left,
      right,
      position,
    };
  }

  /**
   * Create a condition expression (key: value)
   */
  static createCondition(key: string, comparator: Comparator, value: string, position: Position): ConditionExpression {
    return {
      type: AstTypes.Condition,
      key,
      comparator,
      value,
      position,
    };
  }

  /**
   * Create a group expression (parentheses)
   */
  static createGroup(expression: Expression, position: Position): GroupExpression {
    return {
      type: AstTypes.Group,
      expression,
      position,
    };
  }

  /**
   * Create a position object
   */
  static createPosition(start: number, end: number, line?: number, column?: number): Position {
    return {
      start,
      end,
      line,
      column,
    };
  }

  /**
   * Merge multiple positions into a single position that spans all of them
   */
  static mergePositions(...positions: Position[]): Position {
    if (positions.length === 0) {
      return { start: 0, end: 0 };
    }

    const start = Math.min(...positions.map((p) => p.start));
    const end = Math.max(...positions.map((p) => p.end));
    const line = positions[0]?.line;
    const column = positions[0]?.column;

    return { start, end, line, column };
  }

  /**
   * Create a position from a token-like object
   */
  static positionFromToken(token: { position: Position }): Position {
    return { ...token.position };
  }

  /**
   * Validate that an AST node has all required properties
   */
  static validateNode(node: Expression): boolean {
    if (!node || typeof node !== 'object') {
      return false;
    }

    // Check required properties
    if (!node.type || !node.position) {
      return false;
    }

    // Validate position
    if (typeof node.position.start !== 'number' || typeof node.position.end !== 'number') {
      return false;
    }

    // Type-specific validation
    switch (node.type) {
      case AstTypes.Boolean: {
        const boolNode = node as BooleanExpression;
        return !!(boolNode.operator && boolNode.left && boolNode.right);
      }

      case AstTypes.Condition: {
        const condNode = node as ConditionExpression;
        return !!(condNode.key && condNode.comparator && typeof condNode.value === 'string');
      }

      case AstTypes.Group: {
        const groupNode = node as GroupExpression;
        return !!groupNode.expression;
      }

      default:
        return false;
    }
  }

  /**
   * Get the text span of an AST node
   */
  static getNodeSpan(node: Expression): { start: number; end: number } {
    return {
      start: node.position.start,
      end: node.position.end,
    };
  }

  /**
   * Check if two nodes have overlapping positions
   */
  static nodesOverlap(node1: Expression, node2: Expression): boolean {
    const span1 = ASTBuilder.getNodeSpan(node1);
    const span2 = ASTBuilder.getNodeSpan(node2);

    return !(span1.end <= span2.start || span2.end <= span1.start);
  }

  /**
   * Calculate the depth of an AST node
   */
  static calculateDepth(node: Expression): number {
    switch (node.type) {
      case AstTypes.Condition:
        return 1;

      case AstTypes.Group:
        return 1 + ASTBuilder.calculateDepth((node as GroupExpression).expression);

      case AstTypes.Boolean: {
        const boolNode = node as BooleanExpression;
        return 1 + Math.max(ASTBuilder.calculateDepth(boolNode.left), ASTBuilder.calculateDepth(boolNode.right));
      }

      default:
        return 0;
    }
  }

  /**
   * Count the number of nodes in an AST
   */
  static countNodes(node: Expression): number {
    switch (node.type) {
      case AstTypes.Condition:
        return 1;

      case AstTypes.Group:
        return 1 + ASTBuilder.countNodes((node as GroupExpression).expression);

      case AstTypes.Boolean: {
        const boolNode = node as BooleanExpression;
        return 1 + ASTBuilder.countNodes(boolNode.left) + ASTBuilder.countNodes(boolNode.right);
      }

      default:
        return 0;
    }
  }

  /**
   * Extract all condition nodes from an AST
   */
  static extractConditions(node: Expression): ConditionExpression[] {
    const conditions: ConditionExpression[] = [];

    function traverse(current: Expression): void {
      switch (current.type) {
        case AstTypes.Condition:
          conditions.push(current as ConditionExpression);
          break;

        case AstTypes.Group:
          traverse((current as GroupExpression).expression);
          break;

        case AstTypes.Boolean: {
          const boolNode = current as BooleanExpression;
          traverse(boolNode.left);
          traverse(boolNode.right);
          break;
        }
      }
    }

    traverse(node);
    return conditions;
  }

  /**
   * Extract all keys used in an AST
   */
  static extractKeys(node: Expression): string[] {
    const conditions = ASTBuilder.extractConditions(node);
    const keys = [...new Set(conditions.map((c) => c.key))];
    return keys;
  }

  /**
   * Extract all values used in an AST
   */
  static extractValues(node: Expression): string[] {
    const conditions = ASTBuilder.extractConditions(node);
    const values = [...new Set(conditions.map((c) => c.value))];
    return values;
  }

  /**
   * Transform an AST by applying a function to each node
   */
  static transform(node: Expression, transformer: (node: Expression) => Expression): Expression {
    function transformRecursive(current: Expression): Expression {
      let transformed: Expression;

      switch (current.type) {
        case AstTypes.Condition:
          transformed = current;
          break;

        case AstTypes.Group: {
          const groupNode = current as GroupExpression;
          transformed = ASTBuilder.createGroup(transformRecursive(groupNode.expression), groupNode.position);
          break;
        }

        case AstTypes.Boolean: {
          const boolNode = current as BooleanExpression;
          transformed = ASTBuilder.createBooleanExpression(
            boolNode.operator,
            transformRecursive(boolNode.left),
            transformRecursive(boolNode.right),
            boolNode.position,
          );
          break;
        }

        default:
          transformed = current;
      }

      return transformer(transformed);
    }

    return transformRecursive(node);
  }

  /**
   * Clone an AST node (deep copy)
   */
  static clone(node: Expression): Expression {
    return ASTBuilder.transform(node, (n) => ({ ...n }));
  }
}
