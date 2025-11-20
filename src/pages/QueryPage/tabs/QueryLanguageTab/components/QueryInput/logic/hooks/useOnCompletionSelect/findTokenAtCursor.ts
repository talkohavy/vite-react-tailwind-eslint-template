import { type Token, TokenTypes } from 'create-query-language';

/**
 * Finds the token at the cursor position
 *
 * Use Cases for cursor position behavior:
 * 1. "role <= |admin" - token should be "admin"
 * 2. "role <= admin|" - token should be "admin"
 * 3. "role <= ad|min" - token should be "admin"
 * 4. "role <= | admin" - token should be WHITESPACE
 * 5. "role <= admin |" - token should be WHITESPACE
 */
export function findTokenAtCursor(tokens: Token[], cursorPosition: number): Token {
  // tokens.find intentionally uses "<" so that cases like "status <= <cursor-here>pending AND ..."
  // would take the "pending" value and not the WHITESPACE.
  const foundToken = tokens.find((token) => {
    const isWhitespace = token.type === TokenTypes.Whitespace;
    const isInsideToken = cursorPosition >= token.position.start && cursorPosition < token.position.end;
    const isAtEndBoundary = cursorPosition === token.position.end;

    // If cursor is strictly inside a non-whitespace token, use it
    if (isInsideToken && token.type !== TokenTypes.Whitespace) {
      return true;
    }

    if (isWhitespace && isAtEndBoundary) {
      return false;
    }

    // If cursor is inside whitespace or at any token's end boundary,
    // this will be our fallback (nextToken behavior)
    return isInsideToken || isAtEndBoundary;
  });

  if (!foundToken) {
    console.error(
      '`findTokenAtCursor` failed to find a Token at cursor position',
      tokens,
      'cursorPosition:',
      cursorPosition,
    );
    throw new Error('`findTokenAtCursor` failed to find a Token at cursor position');
  }

  return foundToken!;
}
