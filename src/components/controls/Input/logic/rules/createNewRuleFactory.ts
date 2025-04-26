import type { RuleReturnValue } from '../../types';

type CreateNewRuleFactoryProps = {
  checkIsValidValue?: (newValue: string) => boolean;
  transformNewValue?: (value: string) => string;
};

/**
 * @description
 * Creates a rule for when NOT to change an input's value if true.
 */
export function createNewRuleFactory(
  props: CreateNewRuleFactoryProps,
): (maxLength?: number) => (e: any, newValue: string) => RuleReturnValue {
  const { checkIsValidValue = () => true, transformNewValue } = props;

  return (maxLength) =>
    (_e: any, newValue: any): RuleReturnValue => {
      // conditions when value should NOT change:
      if (newValue.length > maxLength! || !checkIsValidValue(newValue)) {
        return { shouldChange: false, newValue: '' };
      }

      newValue = transformNewValue?.(newValue) ?? newValue;
      return { shouldChange: true, newValue };
    };
}
