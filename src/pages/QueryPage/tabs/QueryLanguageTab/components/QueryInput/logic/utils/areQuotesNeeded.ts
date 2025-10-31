/**
 * @description
 * Returns `true` if the value contains any char that's not alphanumeric.
 */
export function areQuotesNeeded(value: string): boolean {
  return /[^a-zA-Z0-9]/.test(value);
}
