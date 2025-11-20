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
 * Imperative handle for TreeView component.
 * Use this to control the tree from outside via ref.
 *
 * @example
 * const treeRef = useRef<TreeViewRef>(null);
 * // Later...
 * await treeRef.current?.expandNode('folder-123'); // Returns a promise if node needs to load children
 */
export type TreeViewRef = {
  /**
   * Expand a specific node by ID.
   * Returns a promise that resolves when the node is expanded (and children are loaded if needed).
   */
  expandNode: (nodeId: string) => Promise<void>;
  /** Collapse a specific node by ID */
  collapseNode: (nodeId: string) => void;
  /** Select a specific node by ID */
  selectNode: (nodeId: string | number) => void;
  /** Expand all nodes in the tree */
  expandAll: () => void;
  /** Collapse all nodes in the tree */
  collapseAll: () => void;
  /** Get the current tree data state */
  getTreeData: () => TreeNode[];
  /** Get the currently selected node ID */
  getSelectedNodeId: () => string | number | null;
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
  /**
   * This function should be memoized to prevent unnecessary re-renders.
   */
  onNodeClick?: (node: TreeNode) => void;
  /**
   * This function should be memoized to prevent unnecessary re-renders.
   */
  onNodeExpand?: (node: TreeNode) => Promise<Array<TreeNode>> | undefined;
  /**
   * This function should be memoized to prevent unnecessary re-renders.
   */
  // TODO: remove eslint rule "no-use-before-defined"

  renderNode?: (props: TreeNodeContentProps) => ReactNode;
};

export type TreeViewProps = SharedNodeProps & {
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
   * NOTE! You do not need to manage the state of the selected node from outside, it will be managed internally.
   * However, use this function to get the node id that is being selected,
   */
  onSelectedNodeIdChange?: (nodeId: string | number) => void;
  className?: string;
  testId?: string;
};

/**
 * Props for TreeNodeItem component
 */
export type TreeNodeItemProps = SharedNodeProps & {
  node: TreeNode;
  level: number;
  updateNode: (nodeId: string, updates: Partial<TreeNode>) => void;
  handleSelectNodeId: (nodeId: string | number) => void;
  expandNode: (nodeId: string) => Promise<void>;
  collapseNode: (nodeId: string) => void;
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
