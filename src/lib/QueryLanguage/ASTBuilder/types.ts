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
  operator: BooleanOperator;
  left: Expression;
  right: Expression;
}

/**
 * Condition expression (key: value)
 */
export interface ConditionExpression extends ASTNode {
  type: typeof ExpressionTypes.Condition;
  key: string;
  comparator: Comparator;
  value: string;
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
