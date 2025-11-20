import type { TreeNode } from '../../types';

type UpdateTreeRecursivelyProps = {
  nodes: TreeNode[];
  /**
   * A function that returns true if the node should be updated.
   */
  predicate: (node: TreeNode) => boolean;
  nodeUpdates: Partial<TreeNode>;
  /**
   * When true, continues processing children even after finding a match.
   * When false, stops at the matched node without processing its children.
   * @default false
   */
  continueAfterMatch?: boolean;
};

export function updateTreeRecursively(props: UpdateTreeRecursivelyProps): TreeNode[] {
  const { nodes, predicate, nodeUpdates, continueAfterMatch = false } = props;

  let changed = false;

  const newNodes = nodes.map((node) => {
    const isMatch = predicate(node);

    if (isMatch) {
      changed = true;

      if (!continueAfterMatch) return { ...node, ...nodeUpdates };

      node = { ...node, ...nodeUpdates };
    }

    if (node.items) {
      const updatedChildren = updateTreeRecursively({ nodes: node.items, predicate, nodeUpdates });

      if (updatedChildren !== node.items) {
        changed = true;
        return { ...node, items: updatedChildren };
      }
    }

    return node;
  });

  return changed ? newNodes : nodes;
}
