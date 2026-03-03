export function uuid() {
  if (typeof crypto.randomUUID === 'undefined') {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 15);
  }

  return crypto.randomUUID();
}
