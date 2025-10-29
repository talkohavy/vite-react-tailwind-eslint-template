import type { NodeTypeValues } from './logic/constants';

export type TreeNode = {
  id: string;
  name: string;
  type: NodeTypeValues;
  items?: Array<TreeNode>;
  isExpanded?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  metadata?: Record<string, any>;
};

export type SharedNodeProps = {
  onNodeClick?: (node: TreeNode) => void;
  onNodeExpand?: (node: TreeNode) => Promise<Array<TreeNode>> | undefined;
  renderNode?: (node: TreeNode, defaultRender: React.ReactNode) => React.ReactNode;
  /**
   * @default false
   */
  showIcons?: boolean;
  /**
   * @default 16
   */
  indentSize?: number;
  /**
   * @default false
   */
  expandOnClick?: boolean;
};
