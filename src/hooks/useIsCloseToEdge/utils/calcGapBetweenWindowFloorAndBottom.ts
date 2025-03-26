type CalcGapBetweenWindowFloorAndBottomProps = {
  clientHeight: number;
  scrollHeight: number;
  scrollTop: number;
};

export function calcGapBetweenWindowFloorAndBottom(props: CalcGapBetweenWindowFloorAndBottomProps) {
  const { clientHeight, scrollHeight, scrollTop } = props;

  const smallWindowHeight = clientHeight;
  const bigContainerHeight = scrollHeight;
  const yPosOfBigContainerFloor = bigContainerHeight;
  const yPosOfSmallWindowFloor = scrollTop + smallWindowHeight;
  const gapBetweenWindowFloorAndBottom = yPosOfBigContainerFloor - yPosOfSmallWindowFloor;

  return gapBetweenWindowFloorAndBottom;
}
