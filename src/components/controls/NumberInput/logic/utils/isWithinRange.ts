type IsWithinRangeProps = {
  newValue: string;
  min: number | undefined;
  max: number | undefined;
};

export function isWithinRange(props: IsWithinRangeProps) {
  const { newValue, min, max } = props;

  if (newValue === '') return true;

  const isHigherThanMin = min === undefined || +newValue >= min;
  const isLowerThanMax = max === undefined || +newValue <= max;
  const isWithinRange = isHigherThanMin && isLowerThanMax;

  return isWithinRange;
}
