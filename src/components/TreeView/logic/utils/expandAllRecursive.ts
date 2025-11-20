import type { TreeNode } from '../../types';
import { NodeTypes } from '../constants';
import { updateTreeRecursively } from './updateTreeRecursively';

function predicate(node: TreeNode) {
  return node.type === NodeTypes.Folder;
}

export function expandAllRecursive(nodes: TreeNode[]): TreeNode[] {
  return updateTreeRecursively({
    nodes,
    predicate,
    nodeUpdates: { isExpanded: true },
    continueAfterMatch: true,
  });
}
