import { useState, useMemo } from 'react';
import type { Token } from '../../../../../lib/QueryLanguage';

type UseCursorPositionLogicProps = {
  tokens: Token[];
};

export function useCursorPositionLogic(props: UseCursorPositionLogicProps) {
  const { tokens } = props;

  const [cursorPosition, setCursorPosition] = useState(0);

  const currentToken = useMemo(() => {
    return (
      tokens.find((token) => cursorPosition >= token.position.start && cursorPosition <= token.position.end) || null
    );
  }, [tokens, cursorPosition]);

  return { cursorPosition, setCursorPosition, currentToken };
}
