import {
  LogicalOperators,
  ContextTypes,
  type ContextTypeValues,
  SpecialChars,
  type TokenContext,
  type TokenContextWithKey,
} from 'create-query-language';
import type { CompletionItem, KeyConfig } from '../../../../types';
import { areQuotesNeeded } from '../../../utils/areQuotesNeeded';
import ValueOptionItem from '../ValueOptionItem';

type HandlerProps = {
  keyConfigs: KeyConfig[];
  currentInput: string;
  context: TokenContext | undefined;
};

export const TOKEN_TYPE_HANDLERS: Record<ContextTypeValues, (props: HandlerProps) => CompletionItem[]> = {
  [ContextTypes.Key]: (props) => {
    const { keyConfigs } = props;

    /**
     * ----Special Edge case:----
     * When the user inputs "(", we want to show him ALL valid keys,
     * so we don't want to check keys that start with "(", ergo we set the current input to an empty string.
     */
    const currentInput = props.currentInput === SpecialChars.LeftParenthesis ? '' : props.currentInput;

    const completions: CompletionItem[] = [];

    keyConfigs.forEach((keyConfig) => {
      const lowercasedKey = keyConfig.name.toLowerCase();
      const lowercasedInput = currentInput.toLowerCase();

      if (!currentInput || lowercasedKey.includes(lowercasedInput)) {
        completions.push({
          type: ContextTypes.Key,
          value: keyConfig.name,
          label: keyConfig.name,
          insertText: areQuotesNeeded(lowercasedKey) ? `"${keyConfig.name}"` : keyConfig.name,
          priority: 1,
        });
      }
    });

    return completions;
  },
  [ContextTypes.Value]: (props) => {
    const { keyConfigs, currentInput, context } = props;

    const completions: CompletionItem[] = [];

    const currentKeyToken = (context as TokenContextWithKey).key;
    const keyConfig = keyConfigs.find((k) => k.name === currentKeyToken);

    if (keyConfig?.values) {
      keyConfig.values.forEach((valueConfig) => {
        const lowercasedValue = valueConfig.value.toLowerCase();
        const lowercasedInput = currentInput.toLowerCase();

        if (!currentInput || lowercasedValue.includes(lowercasedInput)) {
          const shouldAddQuotes = areQuotesNeeded(lowercasedValue);

          completions.push({
            type: shouldAddQuotes ? ContextTypes.QuotedString : ContextTypes.Value,
            value: valueConfig.value,
            label: <ValueOptionItem keyName={currentKeyToken} value={valueConfig.value} />,
            insertText: shouldAddQuotes ? `"${valueConfig.value}"` : valueConfig.value,
            priority: 1,
          });
        }
      });
    }

    return completions;
  },
  [ContextTypes.LogicalOperator]: (props) => {
    const { currentInput } = props;

    const completions: CompletionItem[] = [];

    if (!currentInput || LogicalOperators.AND.toLowerCase().includes(currentInput.toLowerCase())) {
      completions.push({
        type: ContextTypes.LogicalOperator,
        value: LogicalOperators.AND,
        label: LogicalOperators.AND,
        insertText: LogicalOperators.AND,
        priority: 10,
      });
    }
    if (!currentInput || LogicalOperators.OR.toLowerCase().includes(currentInput.toLowerCase())) {
      completions.push({
        type: ContextTypes.LogicalOperator,
        value: LogicalOperators.OR,
        label: LogicalOperators.OR,
        insertText: LogicalOperators.OR,
        priority: 10,
      });
    }

    return completions;
  },
  // TODO: When we start supporting comparators, comment this back in.
  [ContextTypes.Comparator]: (_props) => {
    // 	const completions: CompletionItem[] = [];
    //
    // 	Object.values(Comparators).forEach((comparator) => {
    // 		completions.push({
    // 			type: ContextTypes.Comparator,
    // 			value: comparator,
    // 			label: comparator,
    // 			insertText: comparator,
    // 		});
    // 	});
    //
    // 	return completions;
    return [];
  },
  [ContextTypes.Colon]: (_props) => {
    const completions: CompletionItem[] = [];

    completions.push({
      type: ContextTypes.Colon,
      value: SpecialChars.Colon,
      label: SpecialChars.Colon,
      insertText: SpecialChars.Colon,
      priority: 10,
    });

    return completions;
  },
  [ContextTypes.LeftParenthesis]: (_props) => {
    const completions: CompletionItem[] = [];

    completions.push({
      type: ContextTypes.LeftParenthesis,
      value: SpecialChars.LeftParenthesis,
      label: SpecialChars.LeftParenthesis,
      insertText: SpecialChars.LeftParenthesis,
      priority: 9,
    });

    return completions;
  },
  [ContextTypes.RightParenthesis]: (_props) => {
    const completions: CompletionItem[] = [];

    completions.push({
      type: ContextTypes.RightParenthesis,
      value: SpecialChars.RightParenthesis,
      label: SpecialChars.RightParenthesis,
      insertText: SpecialChars.RightParenthesis,
      priority: 9,
    });

    return completions;
  },
  [ContextTypes.Not]: (_props) => {
    const completions: CompletionItem[] = [];

    completions.push({
      type: ContextTypes.Not,
      value: LogicalOperators.NOT,
      label: LogicalOperators.NOT,
      insertText: LogicalOperators.NOT,
      priority: 10,
    });

    return completions;
  },
  [ContextTypes.QuotedString]: (_props) => {
    return [];
  },
} as const;
