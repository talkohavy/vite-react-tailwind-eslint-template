type CalcGapBetweenWindowCeilingAndContainerCeilingProps = {
  scrollTop: number;
};

export function calcGapBetweenWindowCeilingAndContainerCeiling(
  props: CalcGapBetweenWindowCeilingAndContainerCeilingProps,
) {
  const { scrollTop } = props;

  const yPosOfBigContainerCeiling = 0;
  const yPosOfSmallWindowCeiling = scrollTop;
  const gapBetweenWindowCeilingAndContainerCeiling = yPosOfSmallWindowCeiling - yPosOfBigContainerCeiling;

  return gapBetweenWindowCeilingAndContainerCeiling;
}
