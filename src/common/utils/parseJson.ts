export function parseJson<T = any>(text: any): T | null {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
