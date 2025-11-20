import {
  ASTUtils,
  AstTypes,
  type Expression,
  type ConditionExpression,
  type ASTNode,
  type Position,
} from 'create-query-language';
import type { KeyConfig } from '../../components/QueryInput/types';

export type ValidationError = {
  type: 'invalid-key' | 'invalid-value';
  position: Position;
  message: string;
  key?: string;
  value?: string;
};

export type ValidationResult = {
  areAllKeysValid: boolean;
  areAllValuesValid: boolean;
  errors: ValidationError[];
  invalidKeys: Set<string>;
  invalidValues: Array<{ key: string; value: string }>;
};

type ValidateKeysAndValuesProps = {
  ast: Expression | undefined;
  keyConfigs: KeyConfig[];
};

/**
 * Only runs when query syntax is valid!
 *
 * Validates an AST against the provided key configurations.
 * Returns position-aware errors for invalid keys & values.
 */
export function validateKeysAndValues(props: ValidateKeysAndValuesProps): ValidationResult {
  const { ast, keyConfigs } = props;

  const errors: ValidationError[] = [];
  const invalidKeys = new Set<string>();
  const invalidValues: Array<{ key: string; value: string }> = [];

  if (!ast) {
    return {
      areAllKeysValid: true,
      areAllValuesValid: true,
      errors: [],
      invalidKeys,
      invalidValues,
    };
  }

  function validateConditionNode(node: ASTNode, _parentNode: ASTNode | null) {
    if (node.type === AstTypes.Condition) {
      const conditionNode = node as ConditionExpression;
      const keyValue = conditionNode.key.value;
      const valueValue = conditionNode.value.value;

      // Find the key config
      const keyConfig = keyConfigs.find((k) => k.name === keyValue);

      // Validate key
      if (!keyConfig) {
        invalidKeys.add(keyValue);
        errors.push({
          type: 'invalid-key',
          position: conditionNode.key.position,
          message: `Unknown key: "${keyValue}"`,
          key: keyValue,
        });
      } else {
        // Validate value (only if keyConfig has specific values defined)
        if (keyConfig.values?.length) {
          const isValidValue = keyConfig.values.some((v) => v.value === valueValue);
          if (!isValidValue) {
            invalidValues.push({ key: keyValue, value: valueValue });
            errors.push({
              type: 'invalid-value',
              position: conditionNode.value.position,
              message: `Invalid value "${valueValue}" for key "${keyValue}"`,
              key: keyValue,
              value: valueValue,
            });
          }
        }
      }
    }

    return true; // <--- Continue traversing
  }

  ASTUtils.traverseAST(ast, null, validateConditionNode);

  return {
    areAllKeysValid: invalidKeys.size === 0,
    areAllValuesValid: invalidValues.length === 0,
    errors,
    invalidKeys,
    invalidValues,
  };
}
