import { useState, useCallback } from 'react';
import { twMerge } from 'tailwind-merge';
import type { TreeNode } from './types';
import TreeNodeItem from './TreeNodeItem';

export type TreeViewProps = {
  data: Array<TreeNode>;
  className?: string;
  onNodeClick?: (node: TreeNode) => void;
  onNodeExpand?: (node: TreeNode) => Promise<Array<TreeNode>> | undefined;
  renderNode?: (node: TreeNode, defaultRender: React.ReactNode) => React.ReactNode;
  showIcons?: boolean;
  indentSize?: number;
  expandOnClick?: boolean;
};

export default function TreeView(props: TreeViewProps) {
  const {
    data,
    className,
    onNodeClick,
    onNodeExpand,
    renderNode,
    showIcons = true,
    indentSize = 16,
    expandOnClick = false,
  } = props;

  const [treeData, setTreeData] = useState(data);

  const updateNode = useCallback((nodeId: string, updates: Partial<TreeNode>) => {
    const updateNodeRecursive = (nodes: Array<TreeNode>): Array<TreeNode> => {
      return nodes.map((node) => {
        if (node.id === nodeId) {
          return { ...node, ...updates };
        }
        if (node.children) {
          return { ...node, children: updateNodeRecursive(node.children) };
        }
        return node;
      });
    };

    setTreeData((prevData) => updateNodeRecursive(prevData));
  }, []);

  return (
    <div
      className={twMerge(
        'tree-view p-2 text-sm font-mono bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden',
        className,
      )}
      data-test-id='tree-view-container'
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
