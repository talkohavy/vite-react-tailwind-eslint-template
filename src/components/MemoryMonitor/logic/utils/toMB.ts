import { MB } from '../constants';

export function toMB(bytes: number): number {
  return Math.round((bytes / MB) * 10) / 10;
}
