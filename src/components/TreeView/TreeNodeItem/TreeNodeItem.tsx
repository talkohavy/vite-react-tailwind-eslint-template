import type { SharedNodeEventHandlers, SharedNodeProps, TreeNode } from '../types';
import { DEFAULT_INDENT_SIZE } from '../logic/constants';
import DefaultTreeNodeContent from './content/DefaultTreeNodeContent';
import { useTreeNodeItemLogic } from './logic/useTreeNodeItemLogic';

export type TreeNodeItemProps = Required<SharedNodeProps> &
  SharedNodeEventHandlers & {
    node: TreeNode;
    level: number;
    updateNode: (nodeId: string, updates: Partial<TreeNode>) => void;
    testId?: string;
    testIdPath?: string;
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
    shouldExpandOnClick,
    updateNode,
    testId = '',
    testIdPath = '',
  } = props;

  const { isFolderType, isLoading, isExpanded, iconToShow, handleNodeClick, handleExpandToggle, items } =
    useTreeNodeItemLogic(props);

  return (
    <div>
      {RenderNode ? (
        RenderNode(node, DefaultTreeNodeContent)
      ) : (
        <DefaultTreeNodeContent
          {...props}
          isFolderType={isFolderType}
          isLoading={isLoading}
          isExpanded={isExpanded}
          iconToShow={iconToShow}
          handleNodeClick={handleNodeClick}
          handleExpandToggle={handleExpandToggle}
          testIdPath={testIdPath}
        />
      )}

      {isExpanded && items.length > 0 && (
        <div>
          {items.map((child, index) => (
            <TreeNodeItem
              key={child.id}
              node={child}
              level={level + 1}
              onNodeClick={onNodeClick}
              onNodeExpand={onNodeExpand}
              renderNode={RenderNode}
              showIcons={showIcons}
              indentSize={indentSize}
              shouldExpandOnClick={shouldExpandOnClick}
              updateNode={updateNode}
              testId={testId}
              testIdPath={`${testIdPath}-i${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
