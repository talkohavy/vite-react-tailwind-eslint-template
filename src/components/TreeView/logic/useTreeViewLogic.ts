import { useState, useCallback, type SetStateAction } from 'react';
import type { TreeNode } from '../types';

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

  const updateNode = useCallback((nodeId: string, updates: Partial<TreeNode>) => {
    const updateNodeRecursive = (nodes: Array<TreeNode>): Array<TreeNode> => {
      return nodes.map((node) => {
        const { id, items } = node;

        // if ids match, found the node to update
        if (id === nodeId) return { ...node, ...updates };

        // if has items, recursively check child nodes
        if (items) return { ...node, items: updateNodeRecursive(items) };

        // No changes on this node
        return node;
      });
    };

    setTreeData(updateNodeRecursive);
  }, []);

  return { treeData, updateNode, selectedNodeId, handleSelectNodeId };
}
