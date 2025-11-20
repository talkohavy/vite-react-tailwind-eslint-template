import { useState, useCallback, type SetStateAction } from 'react';
import type { TreeNode } from '../types';
import { collapseAllRecursive } from './utils/collapseAllRecursive';
import { expandAllRecursive } from './utils/expandAllRecursive';
import { updateTreeRecursively } from './utils/updateTreeRecursively';

type UseTreeViewLogicProps = {
  initialState: TreeNode[];
  initialSelectedNodeId: string | number | null;
  onSelectedNodeIdChange?: (nodeId: string | number) => void;
};

export function useTreeViewLogic(props: UseTreeViewLogicProps) {
  const { initialState, initialSelectedNodeId, onSelectedNodeIdChange } = props;

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
    (nodeId: string) => {
      updateNode(nodeId, { isExpanded: true });
    },
    [updateNode],
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
