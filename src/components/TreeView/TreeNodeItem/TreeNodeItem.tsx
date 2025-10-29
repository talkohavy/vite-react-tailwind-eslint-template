import type { SharedNodeProps, TreeNode } from '../types';
import { DEFAULT_INDENT_SIZE } from '../logic/constants';
import DefaultTreeNodeContent from './content/DefaultTreeNodeContent';
import { useTreeNodeItemLogic } from './logic/useTreeNodeItemLogic';

export type TreeNodeItemProps = SharedNodeProps & {
  node: TreeNode;
  level: number;
  updateNode: (nodeId: string, updates: Partial<TreeNode>) => void;
};

export default function TreeNodeItem(props: TreeNodeItemProps) {
  const {
    node,
    level,
    onNodeClick,
    onNodeExpand,
    renderNode: RenderNode,
    showIcons,
    indentSize = DEFAULT_INDENT_SIZE,
    expandOnClick,
    updateNode,
  } = props;

  const { hasItems, isLoading, isExpanded, iconToShow, handleNodeClick, handleExpandToggle, items } =
    useTreeNodeItemLogic(props);

  return (
    <div>
      {RenderNode ? (
        RenderNode(node, DefaultTreeNodeContent)
      ) : (
        <DefaultTreeNodeContent
          {...props}
          hasItems={hasItems}
          isLoading={isLoading}
          isExpanded={isExpanded}
          iconToShow={iconToShow}
          handleNodeClick={handleNodeClick}
          handleExpandToggle={handleExpandToggle}
        />
      )}

      {isExpanded && items.length && (
        <div>
          {items.map((child) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              onNodeClick={onNodeClick}
              onNodeExpand={onNodeExpand}
              renderNode={RenderNode}
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
