type GanttInnerTextProps = {
  label: string;
};

export default function GanttInnerText(props: GanttInnerTextProps) {
  const { label } = props;

  return <span className='truncate px-1 text-xs font-mono'>{label}</span>;
}
