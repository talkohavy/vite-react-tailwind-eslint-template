import type { PositionValues } from '../../logic/constants';

type PositionIconProps = {
  position: PositionValues;
  handleCyclePosition: () => void;
};

/**
 *
 * @description
 * Position cycle button — 2×2 grid, active corner is bright
 */
export default function PositionIcon(props: PositionIconProps) {
  const { position, handleCyclePosition } = props;

  return (
    <button
      type='button'
      onClick={handleCyclePosition}
      title='Move widget'
      className='cursor-pointer rounded p-0.5 opacity-50 transition-opacity hover:opacity-100'
    >
      <svg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
        <rect
          x='1'
          y='1'
          width='5'
          height='5'
          rx='1'
          fill={position === 'top-left' ? 'white' : 'rgba(255,255,255,0.25)'}
        />
        <rect
          x='8'
          y='1'
          width='5'
          height='5'
          rx='1'
          fill={position === 'top-right' ? 'white' : 'rgba(255,255,255,0.25)'}
        />
        <rect
          x='1'
          y='8'
          width='5'
          height='5'
          rx='1'
          fill={position === 'bottom-left' ? 'white' : 'rgba(255,255,255,0.25)'}
        />
        <rect
          x='8'
          y='8'
          width='5'
          height='5'
          rx='1'
          fill={position === 'bottom-right' ? 'white' : 'rgba(255,255,255,0.25)'}
        />
      </svg>
    </button>
  );
}
