import { isOptionGroup } from './isOptionGroup';
import type { Option, OptionGroup } from '../../types';

export function isGroupedOptions(options: Array<Option> | Array<OptionGroup>): options is Array<OptionGroup> {
  const isGrouped = options.length > 0 && isOptionGroup(options[0]!);
  return isGrouped;
}
