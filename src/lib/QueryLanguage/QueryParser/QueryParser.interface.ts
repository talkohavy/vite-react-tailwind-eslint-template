import type { ContextTypeValues } from './logic/constants';

export type AddErrorProps = {
  message: string;
  position: { start: number; end: number };
  code: string;
  expectedTokens?: ContextTypeValues[];
};
