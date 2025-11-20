import type { ReactNode } from 'react';
import type { NodeTypeValues } from './logic/constants';

/**
 * Represents the data structure of the tree.
 * The type of the required prop, `data`, in TreeView component is `TreeNode[]`.
 */
export type TreeNode = {
  id: string;
  /**
   * The file/folder name
   *
   * In case of files, consider including the extension (e.g., "document.txt").
   * It might help in rendering appropriate icons or handling file-specific logic.
   */
  name: string;
  type: NodeTypeValues;
  items?: Array<TreeNode>;
  isExpanded?: boolean;
  isLoading?: boolean;
  icon?: string | (() => React.ReactNode);
  metadata?: Record<string, any>;
};

/**
 * These props will be Optional on TreeView component, and Required on TreeNodeItem component
 */
export type SharedNodeProps = {
  /**
   * @default false
   */
  showIcons?: boolean;
  /**
   * @default false
   */
  shouldExpandOnClick?: boolean;
  /**
   * @default 16
   */
  indentSize?: number;
  /**
   * @default null
   */
  selectedNodeId?: string | number | null;
};

/**
 * These props will be Optional on both TreeView and on TreeNodeItem
 */
export type SharedNodeEventHandlers = {
  onNodeClick?: (node: TreeNode) => void;
  onNodeExpand?: (node: TreeNode) => Promise<Array<TreeNode>> | undefined;
  renderNode?: (props: TreeNodeContentProps) => ReactNode;
};

/**
 * Props for TreeNodeItem component
 */
export type TreeNodeItemProps = Required<SharedNodeProps> &
  SharedNodeEventHandlers & {
    node: TreeNode;
    level: number;
    updateNode: (nodeId: string, updates: Partial<TreeNode>) => void;
    handleSelectNodeId: (nodeId: string | number) => void;
    testId?: string;
  };

/**
 * Props for DefaultTreeNodeContent component, and for CustomNodeContent component
 */
export type TreeNodeContentProps = TreeNodeItemProps & {
  isFolderType: boolean;
  isLoading: boolean;
  isExpanded: boolean;
  isSelected: boolean;
  iconToShow: string | (() => ReactNode) | null;
  handleNodeClick: () => void;
  handleExpandToggle: () => void;
};
