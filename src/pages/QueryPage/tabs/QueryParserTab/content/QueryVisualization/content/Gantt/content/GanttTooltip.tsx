type GanttTooltipProps = {
  label: string;
  start: number;
  end: number;
};

export default function GanttTooltip(props: GanttTooltipProps) {
  const { label, start, end } = props;

  return (
    <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap border border-gray-600'>
      <div>{label}</div>
      <div className='text-gray-400'>
        Position: {start}-{end}
      </div>
      <div className='text-gray-400'>Length: {end - start}</div>
    </div>
  );
}
