type FillerEmptyCardProps = {
  columnWidth: number;
};

export default function FillerEmptyCard(props: FillerEmptyCardProps) {
  const { columnWidth } = props;

  return <div style={{ width: columnWidth }} />;
}
