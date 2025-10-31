import { useCallback, useMemo } from 'react';
import { ContextTypes, type Token, type TokenContext, TokenTypes } from 'create-query-language';
import type { KeyConfig } from '../../../types';
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

      let completions: CompletionItem[] = [];

      context.expectedTokens.forEach((type) => {
        const getCompletions = TOKEN_TYPE_HANDLERS[type];

        const completionsForType = getCompletions({ keyConfigs, currentInput, context });

        completions = completions.concat(completionsForType);
      });

      const completionsSorted = completions.toSorted((a, b) => b.priority - a.priority);

      return completionsSorted;
    },
    [keyConfigs],
  );

  const { completions, expectedTypes, firstErrorTokenIndex } = useMemo(() => {
    try {
      // Find the first error token (Invalid type or where parsing fails)
      const visibleTokens = tokens.filter((token) => token.type !== TokenTypes.Whitespace);
      const firstErrorIndex = visibleTokens.findIndex((token) => token.type === TokenTypes.Invalid);

      let currentToken = tokens.find(
        (token) => cursorPosition >= token.position.start && cursorPosition <= token.position.end,
      );

      if (!currentToken || currentToken.type === TokenTypes.EndOfLine) {
        currentToken ??= { type: TokenTypes.EndOfLine, value: '' } as Token;
        currentToken.context = {
          expectedTokens: [ContextTypes.Key, ContextTypes.LeftParenthesis, ContextTypes.Not],
        };
      }

      const context = currentToken?.context;
      const expectedTypes: string[] = context?.expectedTokens ? [...context.expectedTokens] : [];

      const currentInput = currentToken!.value.trim() ?? '';
      const completions = generateCompletions(context, currentInput);

      return {
        completions,
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
