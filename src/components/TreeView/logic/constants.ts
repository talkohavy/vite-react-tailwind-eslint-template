export const NodeTypes = {
  Folder: 'folder',
  File: 'file',
} as const;

export type NodeTypeValues = (typeof NodeTypes)[keyof typeof NodeTypes];

export const DEFAULT_INDENT_SIZE = 16; // <--- if you change this, don't forget to align the @default notation in the jsdoc.
export const DEFAULT_FOLDER_ICON = '📁';
export const DEFAULT_FILE_ICON = '📄';

export const TREE_VIEW_ROOT_CLASS = 'TreeViewRoot';
export const TREE_VIEW_NODE_CLASS = 'TreeViewNode';
export const TREE_VIEW_NODE_CONTENT_CLASS = 'TreeViewNodeContent';
export const TREE_VIEW_NODE_CONTENT_AS_BUTTON_CLASS = 'TreeViewNodeContentAsButton';
export const TREE_VIEW_NODE_CONTENT_EXPAND_BUTTON_CLASS = 'TreeViewNodeContentExpandButton';
export const TREE_VIEW_NODE_ITEMS_LIST_CLASS = 'TreeViewNodeItem';
