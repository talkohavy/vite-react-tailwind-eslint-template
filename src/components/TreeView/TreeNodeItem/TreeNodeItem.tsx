import type { SharedNodeProps, TreeNode } from '../types';
import { DEFAULT_INDENT_SIZE } from '../logic/constants';
import { useTreeNodeItemLogic } from './logic/useTreeNodeItemLogic';

export type TreeNodeItemProps = SharedNodeProps & {
  node: TreeNode;
  level: number;
  updateNode: (nodeId: string, updates: Partial<TreeNode>) => void;
};

export default function TreeNodeItem(props: TreeNodeItemProps) {
  const {
    level,
    onNodeClick,
    onNodeExpand,
    renderNode,
    showIcons,
    indentSize = DEFAULT_INDENT_SIZE,
    expandOnClick,
    updateNode,
  } = props;

  const { nodeContent, isExpanded, items } = useTreeNodeItemLogic(props);

  return (
    <div>
      {nodeContent}

      {isExpanded && items.length && (
        <div>
          {items.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
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
      )}
    </div>
  );
}
