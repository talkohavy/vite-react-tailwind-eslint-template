import { useState } from 'react';
import clsx from 'clsx';
import MinimizeIcon from './content/MinimizeIcon';
import NotSupported from './content/NotSupported/NotSupported';
import PositionIcon from './content/PositionIcon/PositionIcon';
import ProgressBar from './content/ProgressBar';
import { COLLAPSED_WIDGET_SIZE, Position, WIDGET_WIDTH, type PositionValues } from './logic/constants';
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
  /**
   * @default false
   */
  startMinimized?: boolean;
};

export function MemoryMonitor(props: MemoryMonitorProps) {
  const { position: initialPosition = Position.BottomRight, intervalMs = 1000, startMinimized = false } = props;

  const [collapsed, setCollapsed] = useState(startMinimized);

  const { snapshot, isSupported } = useMemoryMonitorLogic({ intervalMs });

  const { position, handleCyclePosition, winSize, widgetHeight, widgetRef } = usePositionChange({
    initialPosition,
    collapsed,
  });

  if (!isSupported) return <NotSupported position={position} />;
  if (!snapshot) return null;

  const { usedMB, totalMB, limitMB, usedPercent } = snapshot;
  const barColor = getBarColor(usedPercent);
  const textColor = getTextColor(usedPercent);
  const widgetW = collapsed ? COLLAPSED_WIDGET_SIZE : WIDGET_WIDTH;
  const { top, left } = getPositionStyle(position, winSize.w, winSize.h, widgetHeight, widgetW);

  const moveTransition = 'top 0.45s cubic-bezier(0.4,0,0.2,1), left 0.45s cubic-bezier(0.4,0,0.2,1)';

  return (
    <div
      ref={widgetRef}
      style={{
        top,
        left,
        transition: collapsed
          ? `${moveTransition}, opacity 0.25s ease, width 0.2s ease, height 0.2s ease`
          : `${moveTransition}, opacity 0.25s ease, width 0.2s ease, height 0.2s ease, padding 0.2s ease`,
      }}
      className={clsx(
        'fixed z-9999 font-mono text-xs shadow-lg backdrop-blur-sm',
        collapsed
          ? 'h-6 w-6 cursor-pointer overflow-hidden rounded-full border border-white/10 bg-black/80 p-0.5 opacity-20'
          : 'w-52 rounded-lg border border-white/10 bg-black/80 p-3',
      )}
    >
      {collapsed ? (
        <button
          type='button'
          onClick={() => setCollapsed(false)}
          title='Expand memory monitor'
          aria-label='Expand memory monitor'
          className='flex h-full w-full flex-col items-stretch justify-end overflow-hidden rounded-full p-0'
        >
          <div className='h-0.5 w-full rounded-sm' style={{ backgroundColor: barColor }} />
        </button>
      ) : (
        <>
          <div className='mb-2 flex items-center justify-between gap-1'>
            <div className='flex min-w-0 items-center gap-1'>
              <button
                type='button'
                onClick={() => setCollapsed(true)}
                title='Minimize to corner'
                aria-label='Minimize to corner'
                className='shrink-0 cursor-pointer rounded p-0.5 text-white/50 transition-colors hover:text-white/90'
              >
                <MinimizeIcon />
              </button>
              <span className='truncate font-semibold tracking-wider text-white'>MEM MONITOR</span>
            </div>

            <div className='flex shrink-0 items-center gap-2'>
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
        </>
      )}
    </div>
  );
}
