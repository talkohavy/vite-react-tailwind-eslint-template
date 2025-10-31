import clsx from 'clsx';
import type { SharedNodeEventHandlers, SharedNodeProps, TreeNode } from './types';
import { DEFAULT_INDENT_SIZE, TREE_VIEW_ROOT_CLASS } from './logic/constants';
import { useTreeViewLogic } from './logic/useTreeViewLogic';
import TreeNodeItem from './TreeNodeItem';
import styles from './TreeView.module.scss';

export type TreeViewProps = SharedNodeProps &
  SharedNodeEventHandlers & {
    /**
     * Initial data to be displayed in the tree view.
     *
     * NOTE! You do not need to manage the state of the tree data from outside, it will be managed internally.
     */
    initialState: TreeNode[];
    initialSelectedNodeId?: string | number | null;
    /**
     * This function should be memoized to prevent unnecessary re-renders.
     *
     * This function let's you get the node id that is being selected,
     * so you can do whatever you want with it.
     */
    onSelectedNodeIdChange?: (nodeId: string | number) => void;
    className?: string;
    testId?: string;
  };

export default function TreeView(props: TreeViewProps) {
  const {
    initialState,
    onNodeClick,
    onNodeExpand,
    renderNode,
    indentSize = DEFAULT_INDENT_SIZE,
    showIcons = false,
    shouldExpandOnClick = false,
    initialSelectedNodeId = null,
    onSelectedNodeIdChange,
    className,
    testId,
  } = props;

  const { treeData, updateNode, selectedNodeId, handleSelectNodeId } = useTreeViewLogic({
    initialState,
    initialSelectedNodeId,
    onSelectedNodeIdChange,
  });

  return (
    <div className={clsx(TREE_VIEW_ROOT_CLASS, styles.treeView, className)} data-test-id={testId}>
      {treeData.map((node, index) => (
        <TreeNodeItem
          key={node.id}
          node={node}
          level={0}
          selectedNodeId={selectedNodeId}
          handleSelectNodeId={handleSelectNodeId}
          showIcons={showIcons}
          indentSize={indentSize}
          shouldExpandOnClick={shouldExpandOnClick}
          onNodeClick={onNodeClick}
          onNodeExpand={onNodeExpand}
          updateNode={updateNode}
          renderNode={renderNode}
          testId={`tree-view-i${index + 1}`}
        />
      ))}
    </div>
  );
}
