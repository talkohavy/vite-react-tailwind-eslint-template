import { NodeTypes } from '../constants';
import { updateTreeRecursively } from './updateTreeRecursively';
import type { TreeNode } from '../../types';

function predicate(node: TreeNode) {
  return node.type === NodeTypes.Folder;
}

export function collapseAllRecursive(nodes: TreeNode[]): TreeNode[] {
  return updateTreeRecursively({
    nodes,
    predicate,
    nodeUpdates: { isExpanded: false },
    continueAfterMatch: true,
  });
}
