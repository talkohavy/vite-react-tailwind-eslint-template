import clsx from 'clsx';
import type { TreeViewProps } from './types';
import { TREE_VIEW_ROOT_CLASS } from './logic/constants';
import { useTreeViewLogic } from './logic/useTreeViewLogic';
import TreeNodeItem from './TreeNodeItem';
import styles from './TreeView.module.scss';

export default function TreeView(props: TreeViewProps) {
  const {
    reference,
    initialState,
    onNodeClick,
    onNodeExpand,
    renderNode,
    indentSize,
    showIcons,
    shouldExpandOnClick,
    initialSelectedNodeId = null,
    onSelectedNodeIdChange,
    className,
    testId,
  } = props;

  const { treeData, updateNode, selectedNodeId, handleSelectNodeId, expandNode, collapseNode } = useTreeViewLogic({
    reference,
    initialState,
    initialSelectedNodeId,
    onSelectedNodeIdChange,
    onNodeExpand,
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
          expandNode={expandNode}
          collapseNode={collapseNode}
          renderNode={renderNode}
          testId={`tree-view-i${index + 1}`}
        />
      ))}
    </div>
  );
}
