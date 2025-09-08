/**
 * ASTBuilder - Utility functions for building Abstract Syntax Tree nodes
 *
 * This module provides factory functions for creating well-formed AST nodes
 * with proper type checking and position tracking.
 */

import type { Position } from '../types';
import type {
  ASTNode,
  BooleanExpression,
  BooleanOperator,
  Comparator,
  ComparatorNode,
  ConditionExpression,
  Expression,
  GroupExpression,
  KeyNode,
  OperatorNode,
  QueryExpression,
  ValueNode,
} from './types';
import { AstTypes } from './logic/constants';

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
    operator: OperatorNode,
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
   * Create a key node
   */
  static createKey(value: string, position: Position): KeyNode {
    return {
      type: AstTypes.Key,
      value,
      position,
    };
  }

  /**
   * Create a comparator node
   */
  static createComparator(value: Comparator, position: Position): ComparatorNode {
    return {
      type: AstTypes.Comparator,
      value,
      position,
    };
  }

  /**
   * Create an operator node
   */
  static createOperator(value: BooleanOperator, position: Position): OperatorNode {
    return {
      type: AstTypes.Operator,
      value,
      position,
    };
  }

  /**
   * Create a value node
   */
  static createValue(value: string, position: Position): ValueNode {
    return {
      type: AstTypes.Value,
      value,
      position,
    };
  }

  /**
   * Create a condition expression (key: value)
   */
  static createCondition(
    key: KeyNode,
    comparator: ComparatorNode,
    value: ValueNode,
    spacesAfterKey: number,
    spacesAfterComparator: number,
    spacesAfterValue: number,
    position: Position,
  ): ConditionExpression {
    return {
      type: AstTypes.Condition,
      key,
      comparator,
      value,
      spacesAfterKey,
      spacesAfterComparator,
      spacesAfterValue,
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
   * Traverse the AST and apply a callback to each node
   */
  static traverseAST(
    node: Expression,
    parentNode: Expression | null,
    callback: (node: ASTNode, parentNode: ASTNode | null) => boolean,
  ): void {
    const shouldContinueDrillDown = callback(node, parentNode);

    if (!shouldContinueDrillDown) return;

    function traverse(current: Expression): void {
      switch (current.type) {
        case AstTypes.Condition: {
          const conditionNode = current as ConditionExpression;
          callback(conditionNode.key, conditionNode);
          callback(conditionNode.comparator, conditionNode);
          callback(conditionNode.value, conditionNode);
          break;
        }

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
  }
}
