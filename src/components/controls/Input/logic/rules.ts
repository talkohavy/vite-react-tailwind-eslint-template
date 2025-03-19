import type { RuleReturnValue } from '../types';
import { REGEX } from '../../../../common/constants';

type CreateNewRuleFactoryProps = {
  checkIsValidValue?: (newValue: string) => boolean;
  transformNewValue?: (value: string) => string;
};

/**
 * @description
 * Creates a rule for when NOT to change an input's value if true.
 */
function createNewRuleFactory(
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

const createAlphaNumericRule = createNewRuleFactory({
  checkIsValidValue: (newValue) => newValue === '' || REGEX.alphaNumeric.test(newValue),
});
const createIntegerNumbersOnlyRule = createNewRuleFactory({
  checkIsValidValue: (newValue) => newValue === '' || REGEX.integerNumbers.test(newValue),
});
const createNoSpacesAllowedRule = createNewRuleFactory({
  checkIsValidValue: (newValue) => !REGEX.containsWhitespace.test(newValue),
});
const createNoLeadingOrTrailingSpacesRule = createNewRuleFactory({
  checkIsValidValue: (newValue: string) => !REGEX.startsOrEndsWithWhitespace.test(newValue),
});
const createValidCreditCardNumberRule = createNewRuleFactory({
  checkIsValidValue: (newValue) => REGEX.partiallyValidCreditCard.test(newValue),
  transformNewValue: (newValue) => {
    newValue = newValue.replace(/\s/g, '');

    // Case 1: Add nothing
    if (newValue.length < 5) return '';

    // Case 2: Add +1 space
    if (newValue.length < 9) return `${newValue.substring(0, 4)} ${newValue.substring(4)}`;

    // Case 3: Add +2 space
    if (newValue.length < 13) return `${newValue.substring(0, 4)} ${newValue.substring(4, 8)} ${newValue.substring(8)}`;

    // Case 4: Add +3 spaces
    return `${newValue.substring(0, 4)} ${newValue.substring(4, 8)} ${newValue.substring(8, 12)} ${newValue.substring(
      12,
      16,
    )}`;
  },
});

export {
  createAlphaNumericRule,
  createIntegerNumbersOnlyRule,
  createNoLeadingOrTrailingSpacesRule,
  createNoSpacesAllowedRule,
  createValidCreditCardNumberRule,
};
