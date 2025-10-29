import { useCallback, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import type { SharedNodeProps, TreeNode } from '../types';
import RightArrow from '../../svgs/RightArrow/RightArrow';
import { DEFAULT_INDENT_SIZE, NodeTypes } from '../logic/constants';

type TreeNodeItemProps = SharedNodeProps & {
  node: TreeNode;
  level: number;
  updateNode: (nodeId: string, updates: Partial<TreeNode>) => void;
};

export default function TreeNodeItem(props: TreeNodeItemProps) {
  const {
    node,
    level,
    onNodeClick,
    onNodeExpand,
    renderNode,
    showIcons,
    indentSize = DEFAULT_INDENT_SIZE,
    expandOnClick,
    updateNode,
  } = props;

  const [isExpanded, setIsExpanded] = useState(node.isExpanded || false);
  const [items, setItems] = useState<Array<TreeNode>>(node.items || []);
  const [isLoading, setIsLoading] = useState(false);

  const hasItems = node.type === NodeTypes.Folder && (items.length > 0 || onNodeExpand);
  const canExpand = hasItems && !isLoading;

  const handleExpandToggle = useCallback(async () => {
    if (!canExpand) return;

    if (!isExpanded && onNodeExpand && items.length === 0) {
      setIsLoading(true);
      updateNode(node.id, { isLoading: true });

      try {
        const newItems = await onNodeExpand(node);
        if (newItems) {
          setItems(newItems);
          updateNode(node.id, { items: newItems, isLoading: false });
        }
      } catch (error) {
        console.error('Error loading items:', error);
        updateNode(node.id, { isLoading: false });
      } finally {
        setIsLoading(false);
      }
    }

    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    updateNode(node.id, { isExpanded: newExpanded });
  }, [canExpand, isExpanded, onNodeExpand, items.length, node, updateNode]);

  const handleNodeClick = useCallback(() => {
    if (expandOnClick && hasItems) {
      handleExpandToggle();
    }
    onNodeClick?.(node);
  }, [expandOnClick, hasItems, handleExpandToggle, onNodeClick, node]);

  const defaultIcon = node.type === NodeTypes.Folder ? '📁' : '📄';
  const iconToShow = showIcons ? node.icon || defaultIcon : null;

  const defaultRender = (
    <div
      className={twMerge(
        'flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer rounded select-none',
        node.type === NodeTypes.File && 'text-gray-700 dark:text-gray-300',
        node.type === NodeTypes.Folder && 'text-gray-900 dark:text-gray-100 font-medium',
      )}
      style={{ marginLeft: `${level * indentSize}px` }}
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

      <span className='flex-1 truncate'>{node.name}</span>

      {isLoading && <span className='ml-2 text-xs text-gray-500 dark:text-gray-400'>Loading...</span>}
    </div>
  );

  const nodeContent = renderNode ? renderNode(node, defaultRender) : defaultRender;

  return (
    <div>
      {nodeContent}
      {isExpanded && items.length > 0 && (
        <div>
          {items.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              onNodeClick={onNodeClick}
              onNodeExpand={onNodeExpand}
              renderNode={renderNode}
              showIcons={showIcons}
              indentSize={indentSize}
              expandOnClick={expandOnClick}
              updateNode={updateNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
