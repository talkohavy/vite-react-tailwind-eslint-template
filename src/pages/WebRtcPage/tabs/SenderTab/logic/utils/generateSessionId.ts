export function generateSessionId(): string {
  return crypto.randomUUID();
}
