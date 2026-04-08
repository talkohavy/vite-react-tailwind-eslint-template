import clsx from 'clsx';

type ProgressBarProps = {
  usedPercent: number;
  barColor: string;
};

export default function ProgressBar(props: ProgressBarProps) {
  const { usedPercent, barColor } = props;

  const width = `${Math.min(usedPercent, 100)}%`;

  return (
    <div className='mb-2.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10'>
      <div className={clsx('h-full rounded-full transition-all duration-700', barColor)} style={{ width }} />
    </div>
  );
}
