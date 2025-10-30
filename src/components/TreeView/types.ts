import type { ReactNode } from 'react';
import type { NodeTypeValues } from './logic/constants';

export type TreeNode = {
  id: string;
  /**
   * File/Folder name
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
};

export type SharedNodeEventHandlers = {
  onNodeClick?: (node: TreeNode) => void;
  onNodeExpand?: (node: TreeNode) => Promise<Array<TreeNode>> | undefined;
  renderNode?: (node: TreeNode, DefaultRender: (props: any) => ReactNode) => ReactNode;
};
