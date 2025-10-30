import { useCallback, useMemo } from 'react';
import { type TokenContext, TokenTypes, type Token } from 'create-query-language';
import type { KeyConfig } from '../../../tabs/QueryLanguageTab/types';
import type { CompletionItem } from './types';
import { TOKEN_TYPE_HANDLERS } from './logic/tokenTypeToHandlerMapper';

interface UseSuggestionEngineProps {
  tokens: Token[];
  cursorPosition: number;
  keyConfigs: KeyConfig[];
}

export function useSuggestionEngine(props: UseSuggestionEngineProps) {
  const { tokens, keyConfigs, cursorPosition } = props;

  const generateCompletions = useCallback(
    (context: TokenContext | undefined, currentInput: string): CompletionItem[] => {
      if (!context) return [];

      const completions: CompletionItem[] = [];

      context.expectedTokens.forEach((type) => {
        const addCompletions = TOKEN_TYPE_HANDLERS[type];

        addCompletions({ keyConfigs, currentInput, context, completions });
      });

      // const completionsSorted = completions.toSorted((a, b) => b.priority - a.priority);

      return completions;
    },
    [keyConfigs],
  );

  const { completions, expectedTypes, firstErrorTokenIndex } = useMemo(() => {
    try {
      // Find the first error token (Invalid type or where parsing fails)
      const visibleTokens = tokens.filter((token) => token.type !== TokenTypes.Whitespace);
      const firstErrorIndex = visibleTokens.findIndex((token) => token.type === TokenTypes.Invalid);

      const currentToken = tokens.find(
        (token) => cursorPosition >= token.position.start && cursorPosition <= token.position.end,
      );

      let expectedTypes: string[] = [];

      if (currentToken?.context?.expectedTokens) {
        expectedTypes = [...currentToken.context.expectedTokens];
      }

      const currentInput = currentToken!.value.trim() ?? '';
      const suggestions = generateCompletions(currentToken?.context, currentInput);

      return {
        completions: suggestions,
        expectedTypes,
        firstErrorTokenIndex: firstErrorIndex >= 0 ? firstErrorIndex : undefined,
      };
    } catch (error) {
      console.error('Error getting completions:', error);

      return { completions: [], expectedTypes: [], tokens: [], firstErrorTokenIndex: undefined };
    }
  }, [cursorPosition, tokens, generateCompletions]);

  return { completions, expectedTypes, firstErrorTokenIndex };
}
