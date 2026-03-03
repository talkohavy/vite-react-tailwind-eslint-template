export function formatLogPayload(payload: unknown): string {
  if (typeof payload === 'object' && payload !== null && 'message' in payload) {
    return String((payload as { message: string }).message);
  }

  return String(payload);
}
