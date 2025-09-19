import { TokenTypes, type Token } from 'create-query-language';

type UseOnCompletionSelectProps = {
  tokens: Token[];
  cursorPosition: number;
  query: string;
};

export function useOnCompletionSelect(props: UseOnCompletionSelectProps) {
  const { tokens, cursorPosition, query } = props;

  const onCompletionSelect = (completion: any) => {
    /**
     * Use Cases:
     * 1. "role <= |admin" - token should be "admin"
     * 2. "role <= admin|" - token should be "admin"
     * 3. "role <= ad|min" - token should be "admin"
     * 4. "role <= | admin" - token should be WHITESPACE
     * 5. "role <= admin |" - token should be WHITESPACE
     */
    // Find uses < intentionally! So that cases like "status <= <cursor-here>pending AND ..." would take the "pending" adn not the WHITESPACE.
    const currentToken = tokens.find(
      (token) => cursorPosition >= token.position.start && cursorPosition < token.position.end,
    )!;
    const nextToken = tokens.find(
      (token) => cursorPosition >= token.position.start && cursorPosition <= token.position.end,
    )!;
    const token = currentToken && currentToken.type !== TokenTypes.Whitespace ? currentToken : nextToken;

    const addedWhitespaces = token.type === TokenTypes.Whitespace ? ' ' : '';

    /**
     * Replace Logic:
     *
     *
     */
    const tokenPosition = completion.label === ':' ? token.position.end : token.position.start;

    const leftPart = `${query.substring(0, tokenPosition)}${addedWhitespaces}`;
    const insertText = completion.label;
    const rightPart = `${addedWhitespaces}${query.substring(token.position.end)}`.trimEnd();
    const newValue = leftPart + insertText + rightPart;

    const newCursorPosition = leftPart.length + insertText.length;

    return { value: newValue, cursorPosition: newCursorPosition };
  };

  return onCompletionSelect;
}
