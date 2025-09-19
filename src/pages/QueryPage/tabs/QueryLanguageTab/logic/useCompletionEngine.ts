import { useCallback } from 'react';
import {
  BooleanOperators,
  ContextTypes,
  type TokenContextWithKey,
  type TokenContext,
  Comparators,
  type ContextTypeValues,
} from 'create-query-language';
import type { CompletionItem, KeyConfig } from '../types';

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
        const addCompletions = TOKEN_TYPE_HANDLERS[type];

        addCompletions({ keyConfigs, currentInput, context, completions });
      });

      const completionsSorted = completions.toSorted((a, b) => b.priority - a.priority);

      return completionsSorted;
    },
    [keyConfigs, query],
  );

  return { generateCompletions };
}

type HandlerProps = {
  keyConfigs: KeyConfig[];
  currentInput: string;
  context: TokenContext | undefined;
  completions: CompletionItem[];
};

const TOKEN_TYPE_HANDLERS: Record<ContextTypeValues, (props: HandlerProps) => void> = {
  [ContextTypes.Key]: (props: HandlerProps) => {
    const { keyConfigs, currentInput, completions } = props;

    keyConfigs.forEach((keyConfig) => {
      const lowercasedKey = keyConfig.name.toLowerCase();
      if (!currentInput || lowercasedKey.includes(currentInput.toLowerCase())) {
        const needsQuotes = lowercasedKey.includes(' ');

        completions.push({
          text: needsQuotes ? `"${keyConfig.name}"` : keyConfig.name,
          type: ContextTypes.Key,
          description: keyConfig.description,
          priority: 10,
        });
      }
    });
  },
  [ContextTypes.Value]: (props: HandlerProps) => {
    const { keyConfigs, currentInput, context, completions } = props;

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
  },
  [ContextTypes.LogicalOperator]: (props: HandlerProps) => {
    const { currentInput, completions } = props;

    if (!currentInput || BooleanOperators.AND.toLowerCase().includes(currentInput.toLowerCase())) {
      completions.push({
        text: BooleanOperators.AND,
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
  },
  [ContextTypes.Comparator]: (props: HandlerProps) => {
    const { completions } = props;

    Object.values(Comparators).forEach((comp, index) => {
      completions.push({
        text: comp,
        type: ContextTypes.Comparator,
        description: `Comparison operator: ${comp}`,
        priority: 7 - index,
      });
    });
  },
  [ContextTypes.Colon]: (props: HandlerProps) => {
    const { completions } = props;

    completions.push({
      text: ':',
      type: ContextTypes.Colon,
      description: 'Basic comparison operator',
      priority: 10,
    });
  },
  [ContextTypes.LeftParenthesis]: (props: HandlerProps) => {
    const { completions } = props;

    completions.push({
      text: '(',
      type: ContextTypes.LeftParenthesis,
      description: 'Start grouping with parentheses',
      priority: 6,
    });
  },
  [ContextTypes.RightParenthesis]: (props: HandlerProps) => {
    const { completions } = props;

    completions.push({
      text: ')',
      type: ContextTypes.RightParenthesis,
      description: 'End grouping with parentheses',
      priority: 6,
    });
  },
  [ContextTypes.QuotedString]: (_props: HandlerProps) => {},
} as const;
