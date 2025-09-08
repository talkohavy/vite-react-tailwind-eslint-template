import type { VisualizationItem } from '../types';
import GanttItem from './content/GanttItem';
import GanttLegend from './content/GanttLegend';
import TotalItemsCounterProps from './content/TotalItemsCounter';
import XAxis from './content/XAxis';

type GanttProps = {
  maxLevel: number;
  visualizationData: VisualizationItem[];
  queryLength: number;
};

export default function Gantt(props: GanttProps) {
  const { maxLevel, visualizationData, queryLength } = props;

  return (
    <div>
      <div className='space-y-2'>
        {Array.from({ length: maxLevel + 1 }, (_, levelIndex) => {
          const levelItems = visualizationData.filter((item) => item.level === levelIndex);
          const levelType = levelIndex === 0 ? 'Tokens' : `AST Level ${levelIndex}`;

          return (
            <div key={levelIndex} className='mb-4'>
              <TotalItemsCounterProps levelType={levelType} itemCount={levelItems.length} />

              <div className='relative h-8 bg-gray-800 rounded border border-gray-700'>
                {levelItems.map((item) => (
                  <GanttItem key={item.id} item={item} queryLength={queryLength} />
                ))}

                <XAxis queryLength={queryLength} />
              </div>
            </div>
          );
        })}
      </div>

      <GanttLegend />
    </div>
  );
}
