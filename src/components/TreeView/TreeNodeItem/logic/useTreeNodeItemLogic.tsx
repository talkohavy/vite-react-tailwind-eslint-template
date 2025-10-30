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

  const isFolderType = nodeType === NodeTypes.Folder;
  const canExpand = isFolderType && !isLoading;

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

    const newIsExpanded = !isExpanded;
    setIsExpanded(newIsExpanded);

    const newNodeState = { isExpanded: newIsExpanded };

    updateNode(id, newNodeState);
  }, [canExpand, isExpanded, items.length, node, onNodeExpand, updateNode]);

  const handleNodeClick = useCallback(() => {
    if (isFolderType && expandOnClick) {
      handleExpandToggle();
    }

    onNodeClick?.(node);
  }, [expandOnClick, isFolderType, handleExpandToggle, onNodeClick, node]);

  const defaultIcon = nodeType === NodeTypes.Folder ? DEFAULT_FOLDER_ICON : DEFAULT_FILE_ICON;
  const iconToShow = showIcons ? icon || defaultIcon : null;

  return { items, isExpanded, isFolderType, isLoading, handleNodeClick, handleExpandToggle, iconToShow };
}
