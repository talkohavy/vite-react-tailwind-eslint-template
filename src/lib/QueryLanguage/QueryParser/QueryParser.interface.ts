import type { ContextTypeValues } from '../ContextAnalyzer/logic/constants';

export type AddErrorProps = {
  message: string;
  position: { start: number; end: number };
  code: string;
  expectedTokens?: ContextTypeValues[];
};
