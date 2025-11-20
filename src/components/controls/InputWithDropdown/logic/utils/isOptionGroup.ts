import type { Option, OptionGroup } from '../../types';

export function isOptionGroup(item: Option | OptionGroup): item is OptionGroup {
  return 'items' in item && Array.isArray(item.items);
}
