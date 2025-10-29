import { useCallback, useState } from 'react';
import type { TreeNode } from '@ark-ui/react/collection';
import type { TreeNodeItemProps } from '../TreeNodeItem';
import { DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON, NodeTypes } from '../../logic/constants';

export function useTreeNodeItemLogic(props: TreeNodeItemProps) {
  const { node, updateNode, onNodeExpand, onNodeClick, expandOnClick, showIcons } = props;

  const { id, type: nodeType, isExpanded: initialIsExpanded, items: initialItems, icon } = node;

  const [isExpanded, setIsExpanded] = useState(initialIsExpanded || false);
  const [items, setItems] = useState<Array<TreeNode>>(initialItems || []);
  const [isLoading, setIsLoading] = useState(false);

  const hasItems = nodeType === NodeTypes.Folder && !!(items.length || onNodeExpand);
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

  const defaultIcon = nodeType === NodeTypes.Folder ? DEFAULT_FOLDER_ICON : DEFAULT_FILE_ICON;
  const iconToShow = showIcons ? icon || defaultIcon : null;

  return { isExpanded, items, handleNodeClick, handleExpandToggle, hasItems, isLoading, iconToShow };
}
