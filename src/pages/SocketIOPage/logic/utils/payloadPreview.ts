export function payloadPreview(payload: unknown): string {
  if (payload === undefined || payload === null) return '—';

  try {
    return typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
  } catch {
    return String(payload);
  }
}
