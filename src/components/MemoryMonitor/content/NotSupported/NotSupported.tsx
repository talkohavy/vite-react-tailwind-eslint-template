import { POSITION_CLASSES, type PositionValues } from '../../logic/constants';

type NotSupportedProps = {
  position: PositionValues;
};

export default function NotSupported(props: NotSupportedProps) {
  const { position } = props;

  return (
    <div
      className={`fixed ${POSITION_CLASSES[position]} z-9999 rounded-lg border border-white/10 bg-black/80 px-3 py-2 font-mono text-xs text-gray-400 shadow-lg backdrop-blur-sm`}
    >
      <span className='font-semibold text-white'>MEM</span> — not supported in this browser
    </div>
  );
}
