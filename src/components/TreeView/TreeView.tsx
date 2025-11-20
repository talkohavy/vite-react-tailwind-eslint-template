import { forwardRef, useImperativeHandle } from 'react';
import clsx from 'clsx';
import type { TreeViewProps, TreeViewRef } from './types';
import { TREE_VIEW_ROOT_CLASS } from './logic/constants';
import { useTreeViewLogic } from './logic/useTreeViewLogic';
import TreeNodeItem from './TreeNodeItem';
import styles from './TreeView.module.scss';

function TreeViewToForward(props: TreeViewProps, ref: React.Ref<TreeViewRef>) {
  const {
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

  const {
    treeData,
    updateNode,
    selectedNodeId,
    handleSelectNodeId,
    expandNode,
    collapseNode,
    expandAll,
    collapseAll,
    getTreeData,
    getSelectedNodeId,
  } = useTreeViewLogic({ initialState, initialSelectedNodeId, onSelectedNodeIdChange, onNodeExpand });

  useImperativeHandle(
    ref,
    () => ({
      expandNode,
      collapseNode,
      selectNode: handleSelectNodeId,
      expandAll,
      collapseAll,
      getTreeData,
      getSelectedNodeId,
    }),
    [expandNode, collapseNode, handleSelectNodeId, expandAll, collapseAll, getTreeData, getSelectedNodeId],
  );

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

const TreeView = forwardRef<TreeViewRef, TreeViewProps>(TreeViewToForward);

export default TreeView;
