import { useCallback, useMemo, useState } from 'react';
import type { TreeNode, TreeNodeItemProps } from '../../types';
import { DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON, NodeTypes } from '../../logic/constants';

export function useTreeNodeItemLogic(props: TreeNodeItemProps) {
  const {
    node,
    updateNode,
    onNodeExpand,
    onNodeClick,
    shouldExpandOnClick,
    showIcons,
    selectedNodeId,
    handleSelectNodeId,
  } = props;

  const { type: nodeType, isExpanded: initialIsExpanded, items: initialItems, icon } = node;

  const [isExpanded, setIsExpanded] = useState(initialIsExpanded || false);
  const [items, setItems] = useState<Array<TreeNode>>(initialItems || []);
  const [isLoading, setIsLoading] = useState(false);

  const isSelected = useMemo(() => {
    return node.id === selectedNodeId;
  }, [selectedNodeId, node.id]);

  const isFolderType = nodeType === NodeTypes.Folder;
  const canExpand = isFolderType && !isLoading;

  const handleExpandToggle = useCallback(async () => {
    if (!canExpand) return;

    const isCollapsedNode = !isExpanded;
    const hasLoadFunction = !!onNodeExpand;
    const hasNoChildren = items.length === 0;
    const shouldLoadChildren = isCollapsedNode && hasLoadFunction && hasNoChildren;

    if (shouldLoadChildren) {
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

    const newIsExpanded = !isExpanded;
    setIsExpanded(newIsExpanded);

    const newNodeState = { isExpanded: newIsExpanded };

    updateNode(node.id, newNodeState);
  }, [canExpand, isExpanded, items.length, node, onNodeExpand, updateNode]);

  const handleNodeClick = useCallback(() => {
    if (isFolderType && shouldExpandOnClick) handleExpandToggle();

    if (selectedNodeId !== node.id) handleSelectNodeId(node.id);

    onNodeClick?.(node);
  }, [shouldExpandOnClick, isFolderType, handleExpandToggle, onNodeClick, node, selectedNodeId, handleSelectNodeId]);

  const defaultIcon = nodeType === NodeTypes.Folder ? DEFAULT_FOLDER_ICON : DEFAULT_FILE_ICON;
  const iconToShow = showIcons ? icon || defaultIcon : null;

  return { items, isExpanded, isFolderType, isLoading, isSelected, handleNodeClick, handleExpandToggle, iconToShow };
}
