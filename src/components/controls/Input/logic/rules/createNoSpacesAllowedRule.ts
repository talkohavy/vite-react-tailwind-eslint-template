import { REGEX } from '../../../../../common/constants';
import { createNewRuleFactory } from './createNewRuleFactory';

export const createNoSpacesAllowedRule = createNewRuleFactory({
  checkIsValidValue: (newValue) => !REGEX.containsWhitespace.test(newValue),
});
