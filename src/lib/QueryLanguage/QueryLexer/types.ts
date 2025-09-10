import type { TokenContext } from '../types';
import type { TokenTypeValues } from './logic/constants';

export interface Position {
  start: number;
  end: number;
  line?: number;
  column?: number;
}

export interface Token {
  type: TokenTypeValues;
  value: string;
  position: Position;
  context?: TokenContext;
}
