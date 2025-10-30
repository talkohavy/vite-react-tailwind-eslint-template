import clsx from 'clsx';
import type { SharedNodeEventHandlers, SharedNodeProps, TreeNode } from './types';
import { DEFAULT_INDENT_SIZE } from './logic/constants';
import { useTreeViewLogic } from './logic/useTreeViewLogic';
import TreeNodeItem from './TreeNodeItem';
import styles from './TreeView.module.scss';

export type TreeViewProps = SharedNodeProps &
  SharedNodeEventHandlers & {
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
    indentSize = DEFAULT_INDENT_SIZE,
    showIcons = false,
    shouldExpandOnClick = false,
    className,
    testId,
  } = props;

  const { treeData, updateNode } = useTreeViewLogic({ data });

  return (
    <div className={clsx(styles.treeView, className)} data-test-id={testId}>
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
          shouldExpandOnClick={shouldExpandOnClick}
          updateNode={updateNode}
        />
      ))}
    </div>
  );
}
