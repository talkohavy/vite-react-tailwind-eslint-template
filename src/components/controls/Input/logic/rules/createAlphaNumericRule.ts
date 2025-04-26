import { REGEX } from '../../../../../common/constants';
import { createNewRuleFactory } from './createNewRuleFactory';

export const createAlphaNumericRule = createNewRuleFactory({
  checkIsValidValue: (newValue) => newValue === '' || REGEX.alphaNumeric.test(newValue),
});
