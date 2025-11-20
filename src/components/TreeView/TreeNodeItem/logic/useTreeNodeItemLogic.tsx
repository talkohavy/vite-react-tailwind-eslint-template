import { useCallback, useMemo } from 'react';
import type { TreeNodeItemProps } from '../../types';
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

  const isSelected = useMemo(() => {
    return node.id === selectedNodeId;
  }, [selectedNodeId, node.id]);

  const isFolderType = node.type === NodeTypes.Folder;

  const handleExpandToggle = useCallback(async () => {
    const isCollapsedNode = !node.isExpanded;
    const hasLoadFunction = !!onNodeExpand;
    const hasChildren = !!node.items?.length;
    const shouldFetchChildren = isCollapsedNode && hasLoadFunction && !hasChildren;

    if (shouldFetchChildren) {
      updateNode(node.id, { isLoading: true });

      try {
        const newItems = await onNodeExpand(node);
        if (newItems) {
          updateNode(node.id, { items: newItems, isLoading: false });
        } else {
          updateNode(node.id, { isLoading: false });
        }
      } catch {
        updateNode(node.id, { isLoading: false });
      }
    }

    const newNodeState = { isExpanded: !node.isExpanded };

    updateNode(node.id, newNodeState);
  }, [node, onNodeExpand, updateNode]);

  const handleNodeClick = useCallback(() => {
    if (isFolderType && shouldExpandOnClick) handleExpandToggle();

    if (selectedNodeId !== node.id) handleSelectNodeId(node.id);

    onNodeClick?.(node);
  }, [shouldExpandOnClick, isFolderType, handleExpandToggle, onNodeClick, node, selectedNodeId, handleSelectNodeId]);

  const defaultIcon = node.type === NodeTypes.Folder ? DEFAULT_FOLDER_ICON : DEFAULT_FILE_ICON;
  const iconToShow = showIcons ? node.icon || defaultIcon : null;

  return {
    items: node.items,
    isExpanded: !!node.isExpanded,
    isFolderType,
    isLoading: !!node.isLoading,
    isSelected,
    handleNodeClick,
    handleExpandToggle,
    iconToShow,
  };
}
