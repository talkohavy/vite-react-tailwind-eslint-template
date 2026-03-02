import { GUID_SEGMENTS } from '../constants';

export function getGuidSegments(value: string): string[] {
  const withoutDashes = value.replace(/-/g, '');
  const segments: string[] = [];
  let offset = 0;

  for (const len of GUID_SEGMENTS) {
    segments.push(withoutDashes.slice(offset, offset + len));
    offset += len;
  }

  return segments;
}
