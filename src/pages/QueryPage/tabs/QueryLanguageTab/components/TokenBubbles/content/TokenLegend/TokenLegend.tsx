import { useMemo } from 'react';
import type { TokenMetaInfo } from '../../types';
import { TOKEN_TYPE_TO_COLOR } from '../../logic/constants';

type TokenLegendProps = {
  className?: string;
};

export default function TokenLegend(props: TokenLegendProps) {
  const { className = '' } = props;

  const legendItems = useMemo(() => {
    const set = new Set();
    const items: TokenMetaInfo[] = [];

    Object.values(TOKEN_TYPE_TO_COLOR).forEach((obj) => {
      if (!set.has(obj.label)) {
        items.push(obj);
        set.add(obj.label);
      }
    });

    return items;
  }, []);

  return (
    <div className={`mt-2 ${className}`}>
      <details className='group'>
        <summary className='text-xs text-gray-400 cursor-pointer hover:text-gray-300 select-none'>Token Legend</summary>
        <div className='mt-2 flex flex-wrap gap-2'>
          {legendItems.map((item, index) => (
            <div key={index} className='flex items-center gap-1'>
              <span className={`inline-block w-3 h-3 rounded-full ${item.backgroundColor}`} />
              <span className='text-xs text-gray-400'>{item.label}</span>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
