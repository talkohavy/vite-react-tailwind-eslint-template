import { useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import type { CompletionItem } from '../../lib/QueryLanguage/types';

type CompletionDropdownProps = {
  completions: CompletionItem[];
  selectedIndex: number;
  onSelect: (completion: CompletionItem) => void;
  onClose: () => void;
};

export default function CompletionDropdown(props: CompletionDropdownProps) {
  const { completions, selectedIndex, onSelect } = props;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLButtonElement>(null);

  // Scroll to selected item when selection changes
  useEffect(() => {
    if (selectedItemRef.current && dropdownRef.current) {
      const dropdown = dropdownRef.current;
      const selectedItem = selectedItemRef.current;

      const dropdownRect = dropdown.getBoundingClientRect();
      const itemRect = selectedItem.getBoundingClientRect();

      const isAbove = itemRect.top < dropdownRect.top;
      const isBelow = itemRect.bottom > dropdownRect.bottom;

      if (isAbove || isBelow) {
        selectedItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [selectedIndex]);

  function handleItemClick(completion: CompletionItem) {
    onSelect(completion);
  }

  function getItemIcon(type: string) {
    switch (type) {
      case 'key':
        return '🔑';
      case 'value':
        return '📄';
      case 'operator':
        return '⚡';
      case 'grouping':
        return '📁';
      case 'keyword':
        return '💭';
      default:
        return '💡';
    }
  }

  function getItemTypeLabel(type: string) {
    switch (type) {
      case 'key':
        return 'Key';
      case 'value':
        return 'Value';
      case 'operator':
        return 'Operator';
      case 'grouping':
        return 'Grouping';
      case 'keyword':
        return 'Keyword';
      default:
        return 'Item';
    }
  }

  if (completions.length === 0) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className='absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg'
      data-test-id='completion-dropdown'
    >
      {completions.map((completion, index) => (
        <button
          key={`${completion.type}-${completion.text}-${index}`}
          ref={index === selectedIndex ? selectedItemRef : null}
          type='button'
          className={twMerge(
            'flex cursor-pointer items-center px-3 py-2 text-sm transition-colors w-full text-left',
            'hover:bg-blue-50',
            index === selectedIndex ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:text-gray-900',
          )}
          onClick={() => handleItemClick(completion)}
          data-test-id={`completion-item-${index}`}
        >
          <span className='mr-2 text-base'>{getItemIcon(completion.type)}</span>

          <div className='flex-1 min-w-0'>
            <div className='font-medium truncate'>{completion.text}</div>
            {completion.description && <div className='text-xs text-gray-500 truncate'>{completion.description}</div>}
          </div>

          <div className='ml-2 text-xs text-gray-400 font-medium'>{getItemTypeLabel(completion.type)}</div>
        </button>
      ))}
    </div>
  );
}
