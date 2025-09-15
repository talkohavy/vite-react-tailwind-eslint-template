import { TOKEN_LEGEND } from './logic/constants';

type TokenLegendProps = {
  className?: string;
};

export default function TokenLegend(props: TokenLegendProps) {
  const { className = '' } = props;

  return (
    <div className={`mt-2 ${className}`}>
      <details className='group'>
        <summary className='text-xs text-gray-400 cursor-pointer hover:text-gray-300 select-none'>Token Legend</summary>
        <div className='mt-2 flex flex-wrap gap-2'>
          {TOKEN_LEGEND.map((item) => (
            <div key={item.type} className='flex items-center gap-1'>
              <span className={`inline-block w-3 h-3 rounded-full border ${item.color}`} />
              <span className='text-xs text-gray-400'>{item.label}</span>
            </div>
          ))}
          <div className='flex items-center gap-1'>
            <span className='inline-block w-3 h-3 rounded-full border bg-red-100 text-red-800 border-red-300' />
            <span className='text-xs text-gray-400'>Error</span>
          </div>
        </div>
      </details>
    </div>
  );
}
