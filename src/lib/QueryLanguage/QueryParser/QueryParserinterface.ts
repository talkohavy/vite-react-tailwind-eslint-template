import type { TokenTypeValues } from '../QueryLexer/logic/constants';

export type AddErrorProps = {
  message: string;
  position: { start: number; end: number };
  code: string;
  expectedTokens?: TokenTypeValues[];
};
