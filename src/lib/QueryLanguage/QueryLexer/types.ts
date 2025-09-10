import type { Position, TokenContext } from '../types';
import type { TokenTypeValues } from './logic/constants';

export interface Token {
  type: TokenTypeValues;
  value: string;
  position: Position;
  context?: TokenContext;
}
