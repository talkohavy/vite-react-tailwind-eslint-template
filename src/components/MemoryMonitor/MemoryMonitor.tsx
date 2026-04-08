import clsx from 'clsx';
import NotSupported from './content/NotSupported/NotSupported';
import PositionIcon from './content/PositionIcon/PositionIcon';
import ProgressBar from './content/ProgressBar';
import { Position, type PositionValues } from './logic/constants';
import { usePositionChange } from './logic/hooks/usePositionChange';
import { useMemoryMonitorLogic } from './logic/useMemoryMonitorLogic';
import { getBarColor } from './logic/utils/getBarColor';
import { getPositionStyle } from './logic/utils/getPositionStyle';
import { getTextColor } from './logic/utils/getTextColor';

type MemoryMonitorProps = {
  /**
   * Corner of the viewport to anchor the widget.
   * @default 'bottom-right'
   */
  position?: PositionValues;
  /**
   * Polling interval in milliseconds.
   * @default 2000
   */
  intervalMs?: number;
};

export function MemoryMonitor(props: MemoryMonitorProps) {
  const { position: initialPosition = Position.BottomRight, intervalMs = 1000 } = props;

  const { snapshot, isSupported } = useMemoryMonitorLogic({ intervalMs });

  const { position, handleCyclePosition, winSize, widgetHeight, widgetRef } = usePositionChange({ initialPosition });

  if (!isSupported) return <NotSupported position={position} />;
  if (!snapshot) return null;

  const { usedMB, totalMB, limitMB, usedPercent } = snapshot;
  const barColor = getBarColor(usedPercent);
  const textColor = getTextColor(usedPercent);
  const { top, left } = getPositionStyle(position, winSize.w, winSize.h, widgetHeight);

  return (
    <div
      ref={widgetRef}
      style={{ top, left, transition: 'top 0.45s cubic-bezier(0.4,0,0.2,1), left 0.45s cubic-bezier(0.4,0,0.2,1)' }}
      className='fixed z-9999 w-52 rounded-lg border border-white/10 bg-black/80 p-3 font-mono text-xs shadow-lg backdrop-blur-sm'
    >
      <div className='mb-2 flex items-center justify-between'>
        <span className='font-semibold tracking-wider text-white'>MEM MONITOR</span>

        <div className='flex items-center gap-2'>
          <span className={clsx('font-bold', textColor)}>{usedPercent}%</span>

          <PositionIcon position={position} handleCyclePosition={handleCyclePosition} />
        </div>
      </div>

      <ProgressBar usedPercent={usedPercent} barColor={barColor} />

      <div className='flex flex-col gap-1 text-gray-400'>
        <div className='flex justify-between'>
          <span>Used</span>
          <span className={clsx('font-medium', textColor)}>{usedMB} MB</span>
        </div>

        <div className='flex justify-between'>
          <span>Allocated</span>
          <span className='text-gray-300'>{totalMB} MB</span>
        </div>

        <div className='flex justify-between'>
          <span>Limit</span>
          <span className='text-gray-500'>{limitMB} MB</span>
        </div>
      </div>
    </div>
  );
}
