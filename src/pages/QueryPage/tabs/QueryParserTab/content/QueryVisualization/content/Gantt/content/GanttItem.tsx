import type { VisualizationItem } from '../../../types';
import GanttInnerText from './GanttInnerText';
import GanttTooltip from './GanttTooltip';

type GanttItemProps = {
  item: VisualizationItem;
  queryLength: number;
};

export default function GanttItem(props: GanttItemProps) {
  const { item, queryLength } = props;

  function getItemWidth(item: VisualizationItem): number {
    const length = item.end - item.start;
    return Math.max((length / queryLength) * 100, 1); // Minimum 1% width
  }

  function getItemPosition(item: VisualizationItem): number {
    return (item.start / queryLength) * 100;
  }

  return (
    <div
      className='absolute h-6 top-1/2 -translate-y-1/2 rounded text-xs text-white flex items-center justify-center overflow-hidden group transition-all'
      style={{
        left: `${getItemPosition(item)}%`,
        width: `${getItemWidth(item)}%`,
        backgroundColor: item.color,
        minWidth: '20px',
      }}
      title={`${item.label} (${item.start}-${item.end})`}
    >
      <GanttInnerText label={item.label} />

      <GanttTooltip label={item.label} start={item.start} end={item.end} />
    </div>
  );
}
