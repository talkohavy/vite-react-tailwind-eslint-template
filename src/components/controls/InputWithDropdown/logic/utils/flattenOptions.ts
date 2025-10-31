import type { Option, OptionGroup } from '../../types';

export function flattenOptions(options: Array<Option> | Array<OptionGroup>): Option[] {
  const flatOptions = options.flatMap((group) => group.items);
  return flatOptions;
}
