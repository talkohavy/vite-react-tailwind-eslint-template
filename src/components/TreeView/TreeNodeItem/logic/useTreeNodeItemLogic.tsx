import { useCallback, useState } from 'react';
import type { TreeNode } from '@ark-ui/react/collection';
import { twMerge } from 'tailwind-merge';
import type { TreeNodeItemProps } from '../TreeNodeItem';
import RightArrow from '../../../svgs/RightArrow/RightArrow';
import { NodeTypes } from '../../logic/constants';

export function useTreeNodeItemLogic(props: TreeNodeItemProps) {
  const { node, level, updateNode, onNodeExpand, onNodeClick, renderNode, expandOnClick, showIcons, indentSize } =
    props;

  const { id, type: nodeType, name, isExpanded: initialIsExpanded, items: initialItems, icon } = node;

  const [isExpanded, setIsExpanded] = useState(initialIsExpanded || false);
  const [items, setItems] = useState<Array<TreeNode>>(initialItems || []);
  const [isLoading, setIsLoading] = useState(false);

  const hasItems = nodeType === NodeTypes.Folder && (items.length > 0 || onNodeExpand);
  const canExpand = hasItems && !isLoading;

  const handleExpandToggle = useCallback(async () => {
    if (!canExpand) return;

    if (!isExpanded && onNodeExpand && items.length === 0) {
      setIsLoading(true);
      updateNode(id, { isLoading: true });

      try {
        const newItems = await onNodeExpand(node);
        if (newItems) {
          setItems(newItems);
          updateNode(id, { items: newItems, isLoading: false });
        }
      } catch (error) {
        console.error('Error loading items:', error);
        updateNode(id, { isLoading: false });
      } finally {
        setIsLoading(false);
      }
    }

    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    updateNode(id, { isExpanded: newExpanded });
  }, [canExpand, isExpanded, onNodeExpand, items.length, node, updateNode]);

  const handleNodeClick = useCallback(() => {
    if (expandOnClick && hasItems) {
      handleExpandToggle();
    }
    onNodeClick?.(node);
  }, [expandOnClick, hasItems, handleExpandToggle, onNodeClick, node]);

  const defaultIcon = nodeType === NodeTypes.Folder ? '📁' : '📄';
  const iconToShow = showIcons ? icon || defaultIcon : null;

  const defaultRender = (
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
            'flex items-center justify-center w-4 h-4 mr-1 transition-transform duration-200',
            isExpanded ? 'rotate-90' : 'rotate-0',
            isLoading && 'animate-spin',
          )}
          disabled={isLoading}
        >
          <RightArrow className='w-3 h-3' />
        </button>
      )}

      {!hasItems && <div className='w-5' />}

      {iconToShow && <span className='mr-2 text-sm'>{typeof iconToShow === 'string' ? iconToShow : iconToShow}</span>}

      <span className='flex-1 truncate'>{name}</span>

      {isLoading && <span className='ml-2 text-xs text-gray-500 dark:text-gray-400'>Loading...</span>}
    </div>
  );

  const nodeContent = renderNode ? renderNode(node, defaultRender) : defaultRender;

  return { nodeContent, isExpanded, items };
}
