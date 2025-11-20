import type { TreeNode } from '../../types';

export function findNodeById(nodes: TreeNode[], nodeId: string): TreeNode | null {
  for (const node of nodes) {
    if (node.id === nodeId) return node;

    if (node.items) {
      const found = findNodeById(node.items, nodeId);

      if (found) return found;
    }
  }

  return null;
}
