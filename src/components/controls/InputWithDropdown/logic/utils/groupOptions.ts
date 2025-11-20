import type { Option, OptionGroup } from '../../types';

type GroupOptionsProps = {
  options: Array<Option>;
  groupLabel?: string;
};

export function groupOptions(props: GroupOptionsProps): OptionGroup[] {
  const { options, groupLabel = '' } = props;

  const groupedOptions: OptionGroup[] = [
    {
      groupLabel,
      items: [],
    },
  ];

  if (options.length === 0) {
    return groupedOptions;
  }

  options.forEach((item) => {
    groupedOptions[0]!.items.push(item);
  });

  return groupedOptions;
}
