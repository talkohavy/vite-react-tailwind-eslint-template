import {
  BooleanOperators,
  Comparators,
  ContextTypes,
  SpecialChars,
  type TokenContextWithKey,
  type ContextTypeValues,
  type TokenContext,
} from 'create-query-language';
import type { KeyConfig } from '../../../../tabs/QueryLanguageTab/types';
import type { CompletionItem } from '../types';

type HandlerProps = {
  keyConfigs: KeyConfig[];
  currentInput: string;
  context: TokenContext | undefined;
  completions: CompletionItem[];
};

export const TOKEN_TYPE_HANDLERS: Record<ContextTypeValues, (props: HandlerProps) => void> = {
  [ContextTypes.Key]: (props) => {
    const { keyConfigs, currentInput, completions } = props;

    keyConfigs.forEach((keyConfig) => {
      const lowercasedKey = keyConfig.name.toLowerCase();
      const lowercasedInput = currentInput.toLowerCase();

      if (!currentInput || lowercasedKey.includes(lowercasedInput)) {
        const needsQuotes = lowercasedKey.includes(' ');

        completions.push({
          type: ContextTypes.Key,
          value: keyConfig.name,
          label: keyConfig.name,
          insertText: needsQuotes ? `"${keyConfig.name}"` : keyConfig.name,
        });
      }
    });
  },
  [ContextTypes.Value]: (props) => {
    const { keyConfigs, currentInput, context, completions } = props;

    const currentKeyToken = (context as TokenContextWithKey).key;
    const keyConfig = keyConfigs.find((k) => k.name === currentKeyToken);

    if (keyConfig?.values) {
      keyConfig.values.forEach((valueConfig) => {
        const lowercasedValue = valueConfig.value.toLowerCase();
        const lowercasedInput = currentInput.toLowerCase();

        if (!currentInput || lowercasedValue.includes(lowercasedInput)) {
          const needsQuotes = lowercasedValue.includes(' ');

          completions.push({
            type: needsQuotes ? ContextTypes.QuotedString : ContextTypes.Value,
            value: valueConfig.value,
            label: valueConfig.value,
            insertText: needsQuotes ? `"${valueConfig.value}"` : valueConfig.value,
          });
        }
      });
    }
  },
  [ContextTypes.LogicalOperator]: (props) => {
    const { currentInput, completions } = props;

    if (!currentInput || BooleanOperators.AND.toLowerCase().includes(currentInput.toLowerCase())) {
      completions.push({
        type: ContextTypes.LogicalOperator,
        value: BooleanOperators.AND,
        label: BooleanOperators.AND,
        insertText: BooleanOperators.AND,
      });
    }
    if (!currentInput || BooleanOperators.OR.toLowerCase().includes(currentInput.toLowerCase())) {
      completions.push({
        type: ContextTypes.LogicalOperator,
        value: BooleanOperators.OR,
        label: BooleanOperators.OR,
        insertText: BooleanOperators.OR,
      });
    }
  },
  [ContextTypes.Comparator]: (props) => {
    const { completions } = props;

    Object.values(Comparators).forEach((comparator) => {
      completions.push({
        type: ContextTypes.Comparator,
        value: comparator,
        label: comparator,
        insertText: comparator,
      });
    });
  },
  [ContextTypes.Colon]: (props) => {
    const { completions } = props;

    completions.push({
      type: ContextTypes.Colon,
      value: SpecialChars.Colon,
      label: SpecialChars.Colon,
      insertText: SpecialChars.Colon,
    });
  },
  [ContextTypes.LeftParenthesis]: (props) => {
    const { completions } = props;

    completions.push({
      type: ContextTypes.LeftParenthesis,
      value: SpecialChars.LeftParenthesis,
      label: SpecialChars.LeftParenthesis,
      insertText: SpecialChars.LeftParenthesis,
    });
  },
  [ContextTypes.RightParenthesis]: (props) => {
    const { completions } = props;

    completions.push({
      type: ContextTypes.RightParenthesis,
      value: SpecialChars.RightParenthesis,
      label: SpecialChars.RightParenthesis,
      insertText: SpecialChars.RightParenthesis,
    });
  },
  [ContextTypes.Not]: (props) => {
    const { completions } = props;

    completions.push({
      type: ContextTypes.Not,
      value: BooleanOperators.NOT,
      label: BooleanOperators.NOT,
      insertText: BooleanOperators.NOT,
    });
  },
  [ContextTypes.QuotedString]: (_props) => {},
} as const;
