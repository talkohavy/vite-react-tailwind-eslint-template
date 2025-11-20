import { useState, useCallback, type SetStateAction, useImperativeHandle } from 'react';
import type { TreeNode, TreeViewRef } from '../types';
import { collapseAllRecursive } from './utils/collapseAllRecursive';
import { expandAllRecursive } from './utils/expandAllRecursive';
import { findNodeById } from './utils/findNodeById';
import { updateTreeRecursively } from './utils/updateTreeRecursively';

type UseTreeViewLogicProps = {
  reference?: React.Ref<TreeViewRef>;
  initialState: TreeNode[];
  initialSelectedNodeId: string | number | null;
  onSelectedNodeIdChange?: (nodeId: string | number) => void;
  onNodeExpand?: (node: TreeNode) => Promise<Array<TreeNode>> | undefined;
};

export function useTreeViewLogic(props: UseTreeViewLogicProps) {
  const { initialState, initialSelectedNodeId, onSelectedNodeIdChange, onNodeExpand, reference } = props;

  const [treeData, setTreeData] = useState(initialState);
  const [selectedNodeId, setSelectedNodeId] = useState(initialSelectedNodeId);

  const handleSelectNodeId = useCallback(
    (nodeId: string | number) => {
      setSelectedNodeId(nodeId as SetStateAction<string | number | null>);
      onSelectedNodeIdChange?.(nodeId);
    },
    [onSelectedNodeIdChange],
  );

  const updateNode = useCallback((nodeId: string, nodeUpdates: Partial<TreeNode>) => {
    setTreeData((prevTreeState) => {
      const predicate = (node: TreeNode) => node.id === nodeId;
      return updateTreeRecursively({ nodes: prevTreeState, predicate, nodeUpdates });
    });
  }, []);

  const expandNode = useCallback(
    async (nodeId: string) => {
      const node = findNodeById(treeData, nodeId);

      if (!node) return;

      const hasLoadFunction = !!onNodeExpand;
      const hasChildren = !!node.items?.length;
      const shouldFetchChildren = hasLoadFunction && !hasChildren && node.type === 'folder';

      if (shouldFetchChildren) {
        updateNode(nodeId, { isLoading: true });

        try {
          const newItems = await onNodeExpand(node);

          if (newItems) {
            updateNode(nodeId, { items: newItems, isLoading: false, isExpanded: true });
          } else {
            updateNode(nodeId, { isLoading: false, isExpanded: true });
          }
        } catch {
          updateNode(nodeId, { isLoading: false, isExpanded: true });
        }
      } else {
        updateNode(nodeId, { isExpanded: true });
      }
    },
    [updateNode, treeData, onNodeExpand],
  );

  const collapseNode = useCallback(
    (nodeId: string) => {
      updateNode(nodeId, { isExpanded: false });
    },
    [updateNode],
  );

  const expandAll = useCallback(() => {
    setTreeData(expandAllRecursive);
  }, []);

  const collapseAll = useCallback(() => {
    setTreeData(collapseAllRecursive);
  }, []);

  const getTreeData = useCallback(() => {
    return treeData;
  }, [treeData]);

  const getSelectedNodeId = useCallback(() => {
    return selectedNodeId;
  }, [selectedNodeId]);

  useImperativeHandle(
    reference,
    () => ({
      expandNode,
      collapseNode,
      selectNode: handleSelectNodeId,
      expandAll,
      collapseAll,
      getTreeData,
      getSelectedNodeId,
    }),
    [expandNode, collapseNode, handleSelectNodeId, expandAll, collapseAll, getTreeData, getSelectedNodeId],
  );

  return {
    treeData,
    updateNode,
    selectedNodeId,
    handleSelectNodeId,
    expandNode,
    collapseNode,
    expandAll,
    collapseAll,
    getTreeData,
    getSelectedNodeId,
  };
}
