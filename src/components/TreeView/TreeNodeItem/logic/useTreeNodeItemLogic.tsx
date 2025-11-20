import { useCallback, useMemo } from 'react';
import type { TreeNodeItemProps } from '../../types';
import { DEFAULT_FILE_ICON, DEFAULT_FOLDER_ICON, NodeTypes } from '../../logic/constants';

export function useTreeNodeItemLogic(props: TreeNodeItemProps) {
  const {
    node,
    onNodeClick,
    shouldExpandOnClick,
    showIcons,
    selectedNodeId,
    handleSelectNodeId,
    expandNode,
    collapseNode,
  } = props;

  const isSelected = useMemo(() => {
    return node.id === selectedNodeId;
  }, [selectedNodeId, node.id]);

  const isFolderType = node.type === NodeTypes.Folder;

  const handleExpandToggle = useCallback(async () => {
    if (node.isExpanded) {
      collapseNode(node.id);
    } else {
      await expandNode(node.id);
    }
  }, [node.isExpanded, node.id, expandNode, collapseNode]);

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
