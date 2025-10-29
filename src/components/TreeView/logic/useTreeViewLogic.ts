import { useState, useCallback } from 'react';
import type { TreeNode } from '../types';

type UseTreeViewLogicProps = {
  data: TreeNode[];
};

export function useTreeViewLogic(props: UseTreeViewLogicProps) {
  const { data } = props;

  const [treeData, setTreeData] = useState(data);

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

  return { treeData, updateNode };
}
