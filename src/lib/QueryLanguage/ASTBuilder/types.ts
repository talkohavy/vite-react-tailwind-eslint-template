import type { Position } from '../types';
import type { ExpressionTypes } from './logic/constants';

export type BooleanOperator = 'AND' | 'OR';

export type Comparator = ':' | '>' | '<' | '>=' | '<=' | '!=' | '~';

export interface ASTNode {
  type: string;
  position: Position;
}

/**
 * Root query expression
 */
export interface QueryExpression extends ASTNode {
  type: typeof ExpressionTypes.Query;
  expression: Expression;
}

/**
 * Boolean expression (AND/OR operations)
 */
export interface BooleanExpression extends ASTNode {
  type: typeof ExpressionTypes.Boolean;
  operator: OperatorNode;
  left: Expression;
  right: Expression;
}

/**
 * Key node for condition expressions
 */
export interface KeyNode extends ASTNode {
  type: typeof ExpressionTypes.Key;
  value: string;
}

/**
 * Comparator node for condition expressions
 */
export interface ComparatorNode extends ASTNode {
  type: typeof ExpressionTypes.Comparator;
  value: Comparator;
}

/**
 * Operator node for boolean expressions
 */
export interface OperatorNode extends ASTNode {
  type: typeof ExpressionTypes.Operator;
  value: BooleanOperator;
}

/**
 * Value node for condition expressions
 */
export interface ValueNode extends ASTNode {
  type: typeof ExpressionTypes.Value;
  value: string;
}

/**
 * Condition expression (key: value)
 */
export interface ConditionExpression extends ASTNode {
  type: typeof ExpressionTypes.Condition;
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
  type: typeof ExpressionTypes.Group;
  expression: Expression;
}

/**
 * Union type for all expression types
 */
export type Expression = QueryExpression | BooleanExpression | ConditionExpression | GroupExpression;
