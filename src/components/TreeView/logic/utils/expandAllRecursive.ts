import { NodeTypes } from '../constants';
import { updateTreeRecursively } from './updateTreeRecursively';
import type { TreeNode } from '../../types';

function predicate(node: TreeNode) {
  return node.type === NodeTypes.Folder && !!node.items?.length;
}

export function expandAllRecursive(nodes: TreeNode[]): TreeNode[] {
  return updateTreeRecursively({
    nodes,
    predicate,
    nodeUpdates: { isExpanded: true },
    continueAfterMatch: true,
  });
}
