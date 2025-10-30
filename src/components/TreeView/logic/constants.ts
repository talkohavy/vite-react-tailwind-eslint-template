export const NodeTypes = {
  Folder: 'folder',
  File: 'file',
} as const;

export type NodeTypeValues = (typeof NodeTypes)[keyof typeof NodeTypes];

export const DEFAULT_INDENT_SIZE = 16; // <--- if you change this, don't forget to align the @default notation in the jsdoc.
export const DEFAULT_FOLDER_ICON = '📁';
export const DEFAULT_FILE_ICON = '📄';
