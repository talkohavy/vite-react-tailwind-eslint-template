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
    handleSelectNodeId: (nodeId: string | number) => void;
  };

export default function TreeNodeItem(props: TreeNodeItemProps) {
  const {
    node,
    level,
    selectedNodeId,
    handleSelectNodeId,
    indentSize = DEFAULT_INDENT_SIZE,
    showIcons,
    shouldExpandOnClick,
    onNodeClick,
    onNodeExpand,
    updateNode,
    renderNode: RenderNode,
    testId = '',
    testIdPath = '',
  } = props;

  const { items, isFolderType, isLoading, isExpanded, isSelected, iconToShow, handleNodeClick, handleExpandToggle } =
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
          isSelected={isSelected}
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
              selectedNodeId={selectedNodeId}
              handleSelectNodeId={handleSelectNodeId}
              indentSize={indentSize}
              showIcons={showIcons}
              shouldExpandOnClick={shouldExpandOnClick}
              onNodeClick={onNodeClick}
              onNodeExpand={onNodeExpand}
              updateNode={updateNode}
              renderNode={RenderNode}
              testId={testId}
              testIdPath={`${testIdPath}-i${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
