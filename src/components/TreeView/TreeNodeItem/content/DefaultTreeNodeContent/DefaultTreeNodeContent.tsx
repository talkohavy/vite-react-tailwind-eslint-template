import type { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';
import type { TreeNodeItemProps } from '../../TreeNodeItem';
import RightArrow from '../../../../svgs/RightArrow';
import { NodeTypes } from '../../../logic/constants';

type DefaultTreeNodeContentProps = TreeNodeItemProps & {
  hasItems: boolean;
  isLoading: boolean;
  isExpanded: boolean;
  iconToShow: string | (() => ReactNode) | null;
  handleNodeClick: () => void;
  handleExpandToggle: () => void;
};

export default function DefaultTreeNodeContent(props: DefaultTreeNodeContentProps) {
  const {
    node,
    level,
    hasItems,
    isLoading,
    isExpanded,
    iconToShow: IconToShow,
    indentSize,
    handleNodeClick,
    handleExpandToggle,
  } = props;

  const { name, type: nodeType } = node;

  return (
    <div
      className={twMerge(
        'flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded select-none',
        nodeType === NodeTypes.File && 'text-gray-700 dark:text-gray-300',
        nodeType === NodeTypes.Folder && 'text-gray-900 dark:text-gray-100 font-medium',
      )}
      style={{ marginLeft: `${level * indentSize!}px` }}
      onClick={handleNodeClick}
    >
      {hasItems && (
        <button
          type='button'
          onClick={(e) => {
            e.stopPropagation();
            handleExpandToggle();
          }}
          className={twMerge(
            'flex cursor-pointer items-center justify-center w-4 h-4 mr-1 transition-transform duration-200',
            isExpanded ? 'rotate-90' : 'rotate-0',
            isLoading && 'animate-spin',
          )}
          disabled={isLoading}
        >
          <RightArrow className='w-3 h-3' />
        </button>
      )}

      {!hasItems && <div className='w-5' />}

      {IconToShow && (
        <span className='mr-2 text-sm'>{typeof IconToShow === 'string' ? IconToShow : <IconToShow />}</span>
      )}

      <span className='flex-1 truncate'>{name}</span>

      {isLoading && <span className='ml-2 text-xs text-gray-500 dark:text-gray-400'>Loading...</span>}
    </div>
  );
}
