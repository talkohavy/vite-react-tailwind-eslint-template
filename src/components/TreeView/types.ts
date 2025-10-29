export type TreeNode = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: Array<TreeNode>;
  isExpanded?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  metadata?: Record<string, any>;
};
