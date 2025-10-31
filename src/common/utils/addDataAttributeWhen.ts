/**
 * @description
 * Utility function to conditionally add a data attribute.
 *
 * If the condition is true, it returns an empty string (indicating the presence of the attribute).
 *
 * If the condition is false, it returns undefined (indicating the absence of the attribute).
 */
export function addDataAttributeWhen(shouldAdd: boolean) {
  return shouldAdd ? '' : undefined;
}
