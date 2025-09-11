import type { CompletionItem } from '../types';

interface CompletionDropdownProps {
  isOpen: boolean;
  completions: CompletionItem[];
  selectedIndex: number;
  onCompletionSelect: (completion: CompletionItem) => void;
  onSelectedIndexChange: (index: number) => void;
}

export default function CompletionDropdown(props: CompletionDropdownProps) {
  const { isOpen, completions, selectedIndex, onCompletionSelect, onSelectedIndexChange } = props;

  if (!isOpen || completions.length === 0) {
    return null;
  }

  return (
    <div className='absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10'>
      {completions.map((completion: CompletionItem, index: number) => (
        <button
          key={`${completion.text}-${index}`}
          type='button'
          className={`px-4 py-3 cursor-pointer border-b border-gray-700 last:border-b-0 text-left w-full transition-colors ${
            index === selectedIndex ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-white'
          }`}
          onClick={() => onCompletionSelect(completion)}
          onMouseEnter={() => onSelectedIndexChange(index)}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <span className='font-mono'>{completion.text}</span>
              <span className='text-xs px-2 py-1 bg-blue-600 text-white rounded'>{completion.type}</span>
            </div>
            <span className='text-xs text-gray-400'>Priority: {completion.priority}</span>
          </div>
          {completion.description && <div className='text-sm text-gray-400 mt-1'>{completion.description}</div>}
        </button>
      ))}
    </div>
  );
}
