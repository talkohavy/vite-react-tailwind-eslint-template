import type { BooleanOperatorValues, ComparatorValues } from '../constants';
import type { Position } from '../types';
import type { AstTypes } from '../utils';

export interface ASTNode {
  type: string;
  position: Position;
}

/**
 * Root query expression
 */
export interface QueryExpression extends ASTNode {
  type: typeof AstTypes.Query;
  expression: Expression;
}

/**
 * Boolean expression (AND/OR operations)
 */
export interface BooleanExpression extends ASTNode {
  type: typeof AstTypes.Boolean;
  operator: OperatorNode;
  left: Expression;
  right: Expression;
}

/**
 * Key node for condition expressions
 */
export interface KeyNode extends ASTNode {
  type: typeof AstTypes.Key;
  value: string;
}

/**
 * Comparator node for condition expressions
 */
export interface ComparatorNode extends ASTNode {
  type: typeof AstTypes.Comparator;
  value: ComparatorValues;
}

/**
 * Operator node for boolean expressions
 */
export interface OperatorNode extends ASTNode {
  type: typeof AstTypes.LogicalOperator;
  value: BooleanOperatorValues;
}

/**
 * Value node for condition expressions
 */
export interface ValueNode extends ASTNode {
  type: typeof AstTypes.Value;
  value: string;
}

/**
 * Condition expression (key: value)
 */
export interface ConditionExpression extends ASTNode {
  type: typeof AstTypes.Condition;
  key: KeyNode;
  comparator: ComparatorNode;
  value: ValueNode;
  spacesAfterKey: number;
  spacesAfterComparator: number;
  spacesAfterValue: number;
}

/**
 * Grouped expression (parentheses)
 */
export interface GroupExpression extends ASTNode {
  type: typeof AstTypes.Group;
  expression: Expression;
}

/**
 * Union type for all expression types
 */
export type Expression = QueryExpression | BooleanExpression | ConditionExpression | GroupExpression;
