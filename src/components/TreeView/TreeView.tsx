import { useState, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import type { SharedNodeProps, TreeNode } from './types';
import { DEFAULT_INDENT_SIZE } from './logic/constants';
import TreeNodeItem from './TreeNodeItem';

export type TreeViewProps = SharedNodeProps & {
  data: Array<TreeNode>;
  className?: string;
  testId?: string;
};

export default function TreeView(props: TreeViewProps) {
  const {
    data,
    onNodeClick,
    onNodeExpand,
    renderNode,
    showIcons,
    indentSize = DEFAULT_INDENT_SIZE,
    expandOnClick,
    className,
    testId,
  } = props;

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

  return (
    <div
      className={twMerge(
        'tree-view p-2 text-sm font-mono bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden',
        className,
      )}
      data-test-id={testId}
    >
      {treeData.map((node) => (
        <TreeNodeItem
          key={node.id}
          node={node}
          level={0}
          onNodeClick={onNodeClick}
          onNodeExpand={onNodeExpand}
          renderNode={renderNode}
          showIcons={showIcons}
          indentSize={indentSize}
          expandOnClick={expandOnClick}
          updateNode={updateNode}
        />
      ))}
    </div>
  );
}
