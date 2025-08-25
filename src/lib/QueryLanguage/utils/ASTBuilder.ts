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

/**
 * Create a query expression (root node)
 */
export function createQuery(expression: Expression, position: Position): QueryExpression {
  return {
    type: 'query',
    expression,
    position,
  };
}

/**
 * Create a boolean expression (AND/OR operations)
 */
export function createBooleanExpression(
  operator: BooleanOperator,
  left: Expression,
  right: Expression,
  position: Position,
): BooleanExpression {
  return {
    type: 'boolean',
    operator,
    left,
    right,
    position,
  };
}

/**
 * Create a condition expression (key: value)
 */
export function createCondition(
  key: string,
  comparator: Comparator,
  value: string,
  position: Position,
): ConditionExpression {
  return {
    type: 'condition',
    key,
    comparator,
    value,
    position,
  };
}

/**
 * Create a group expression (parentheses)
 */
export function createGroup(expression: Expression, position: Position): GroupExpression {
  return {
    type: 'group',
    expression,
    position,
  };
}

/**
 * Create a position object
 */
export function createPosition(start: number, end: number, line?: number, column?: number): Position {
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
export function mergePositions(...positions: Position[]): Position {
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
export function positionFromToken(token: { position: Position }): Position {
  return { ...token.position };
}

/**
 * Validate that an AST node has all required properties
 */
export function validateNode(node: Expression): boolean {
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
    case 'boolean': {
      const boolNode = node as BooleanExpression;
      return !!(boolNode.operator && boolNode.left && boolNode.right);
    }

    case 'condition': {
      const condNode = node as ConditionExpression;
      return !!(condNode.key && condNode.comparator && typeof condNode.value === 'string');
    }

    case 'group': {
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
export function getNodeSpan(node: Expression): { start: number; end: number } {
  return {
    start: node.position.start,
    end: node.position.end,
  };
}

/**
 * Check if two nodes have overlapping positions
 */
export function nodesOverlap(node1: Expression, node2: Expression): boolean {
  const span1 = getNodeSpan(node1);
  const span2 = getNodeSpan(node2);

  return !(span1.end <= span2.start || span2.end <= span1.start);
}

/**
 * Calculate the depth of an AST node
 */
export function calculateDepth(node: Expression): number {
  switch (node.type) {
    case 'condition':
      return 1;

    case 'group':
      return 1 + calculateDepth((node as GroupExpression).expression);

    case 'boolean': {
      const boolNode = node as BooleanExpression;
      return 1 + Math.max(calculateDepth(boolNode.left), calculateDepth(boolNode.right));
    }

    default:
      return 0;
  }
}

/**
 * Count the number of nodes in an AST
 */
export function countNodes(node: Expression): number {
  switch (node.type) {
    case 'condition':
      return 1;

    case 'group':
      return 1 + countNodes((node as GroupExpression).expression);

    case 'boolean': {
      const boolNode = node as BooleanExpression;
      return 1 + countNodes(boolNode.left) + countNodes(boolNode.right);
    }

    default:
      return 0;
  }
}

/**
 * Extract all condition nodes from an AST
 */
export function extractConditions(node: Expression): ConditionExpression[] {
  const conditions: ConditionExpression[] = [];

  function traverse(current: Expression): void {
    switch (current.type) {
      case 'condition':
        conditions.push(current as ConditionExpression);
        break;

      case 'group':
        traverse((current as GroupExpression).expression);
        break;

      case 'boolean': {
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
export function extractKeys(node: Expression): string[] {
  const conditions = extractConditions(node);
  return [...new Set(conditions.map((c) => c.key))];
}

/**
 * Extract all values used in an AST
 */
export function extractValues(node: Expression): string[] {
  const conditions = extractConditions(node);
  return [...new Set(conditions.map((c) => c.value))];
}

/**
 * Transform an AST by applying a function to each node
 */
export function transform(node: Expression, transformer: (node: Expression) => Expression): Expression {
  function transformRecursive(current: Expression): Expression {
    let transformed: Expression;

    switch (current.type) {
      case 'condition':
        transformed = current;
        break;

      case 'group': {
        const groupNode = current as GroupExpression;
        transformed = createGroup(transformRecursive(groupNode.expression), groupNode.position);
        break;
      }

      case 'boolean': {
        const boolNode = current as BooleanExpression;
        transformed = createBooleanExpression(
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
export function clone(node: Expression): Expression {
  return transform(node, (n) => ({ ...n }));
}
