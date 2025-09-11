import { useCallback } from 'react';
import type { TokenContext, TokenContextWithKey } from '../../../../../lib/QueryLanguage/types';
import type { CompletionItem, KeyConfig } from '../types';
import { ContextTypes } from '../../../../../lib/QueryLanguage/QueryParser';

interface UseCompletionEngineProps {
  keyConfigs: KeyConfig[];
  query: string;
}

export function useCompletionEngine({ keyConfigs, query }: UseCompletionEngineProps) {
  const generateCompletions = useCallback(
    (context: TokenContext | undefined, currentInput: string): CompletionItem[] => {
      if (!context) return [];

      const completions: CompletionItem[] = [];

      context.expectedTokens.forEach((type) => {
        switch (type) {
          case ContextTypes.Key: {
            keyConfigs.forEach((keyConfig) => {
              if (!currentInput || keyConfig.name.toLowerCase().includes(currentInput.toLowerCase())) {
                completions.push({
                  text: keyConfig.name,
                  type: ContextTypes.Key,
                  description: keyConfig.description,
                  priority: 10,
                });
              }
            });
            break;
          }
          case ContextTypes.Value:
          case ContextTypes.QuotedString: {
            const currentKeyToken = (context as TokenContextWithKey).key;
            const keyConfig = keyConfigs.find((k) => k.name === currentKeyToken);

            if (keyConfig?.values) {
              keyConfig.values.forEach((valueConfig) => {
                if (!currentInput || valueConfig.value.toLowerCase().includes(currentInput.toLowerCase())) {
                  const needsQuotes = valueConfig.value.includes(' ');
                  completions.push({
                    text: needsQuotes ? `"${valueConfig.value}"` : valueConfig.value,
                    type: needsQuotes ? ContextTypes.QuotedString : ContextTypes.Value,
                    description: valueConfig.description,
                    priority: 8,
                  });
                }
              });
            }
            break;
          }
          case ContextTypes.LogicalOperator: {
            if (!currentInput || 'AND'.toLowerCase().includes(currentInput.toLowerCase())) {
              completions.push({
                text: 'AND',
                type: ContextTypes.LogicalOperator,
                description: 'Logical AND operator',
                priority: 9,
              });
            }
            if (!currentInput || 'OR'.toLowerCase().includes(currentInput.toLowerCase())) {
              completions.push({
                text: 'OR',
                type: ContextTypes.LogicalOperator,
                description: 'Logical OR operator',
                priority: 9,
              });
            }
            break;
          }
          case ContextTypes.Comparator: {
            const comparators = [':', '==', '!=', '>', '<', '>=', '<='];
            comparators.forEach((comp, index) => {
              completions.push({
                text: comp,
                type: ContextTypes.Comparator,
                description: comp === ':' ? 'Basic comparison (most common)' : `Comparison operator: ${comp}`,
                priority: comp === ':' ? 10 : 7 - index, // Give ':' highest priority
              });
            });
            break;
          }
          case ContextTypes.Colon: {
            completions.push({
              text: ':',
              type: ContextTypes.Colon,
              description: 'Basic comparison operator',
              priority: 10,
            });
            break;
          }
          case ContextTypes.LeftParenthesis: {
            completions.push({
              text: '(',
              type: ContextTypes.LeftParenthesis,
              description: 'Start grouping with parentheses',
              priority: 6,
            });
            break;
          }
          case ContextTypes.RightParenthesis: {
            completions.push({
              text: ')',
              type: ContextTypes.RightParenthesis,
              description: 'End grouping with parentheses',
              priority: 6,
            });
            break;
          }
        }
      });

      const completionsSorted = completions.toSorted((a, b) => b.priority - a.priority);

      return completionsSorted;
    },
    [keyConfigs, query],
  );

  return { generateCompletions };
}
