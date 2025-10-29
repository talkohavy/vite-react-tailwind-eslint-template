export const pageName = 'tree-view-demo';

import type { TreeNode } from '../../../components/TreeView';

// Static data for demonstration
export const staticTreeData: Array<TreeNode> = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    children: [
      {
        id: '2',
        name: 'components',
        type: 'folder',
        children: [
          { id: '3', name: 'Button.tsx', type: 'file', icon: '⚛️' },
          { id: '4', name: 'Input.tsx', type: 'file', icon: '⚛️' },
          { id: '5', name: 'TreeView.tsx', type: 'file', icon: '🌳' },
        ],
      },
      {
        id: '6',
        name: 'pages',
        type: 'folder',
        children: [
          { id: '7', name: 'Home.tsx', type: 'file', icon: '🏠' },
          { id: '8', name: 'About.tsx', type: 'file', icon: 'ℹ️' },
        ],
      },
      { id: '9', name: 'App.tsx', type: 'file', icon: '⚛️' },
      { id: '10', name: 'index.css', type: 'file', icon: '🎨' },
    ],
  },
  {
    id: '11',
    name: 'public',
    type: 'folder',
    children: [
      { id: '12', name: 'favicon.ico', type: 'file', icon: '🌐' },
      { id: '13', name: 'manifest.json', type: 'file', icon: '📄' },
    ],
  },
  { id: '14', name: 'package.json', type: 'file', icon: '📦' },
  { id: '15', name: 'README.md', type: 'file', icon: '📖' },
];

// Dynamic data - starts with folders that need to be loaded
export const dynamicTreeData: Array<TreeNode> = [
  { id: 'root', name: 'My Project', type: 'folder' },
  { id: 'docs', name: 'Documentation', type: 'folder' },
  { id: 'config', name: 'vite.config.ts', type: 'file', icon: '⚙️' },
];

// Static data for custom rendering demo
export const customTreeData: Array<TreeNode> = [
  {
    id: '1',
    name: 'Frontend',
    type: 'folder',
    metadata: { department: 'Engineering', count: 5 },
    children: [
      {
        id: '2',
        name: 'Button.tsx',
        type: 'file',
        icon: '⚛️',
        metadata: { language: 'TypeScript', size: '2.1KB' },
      },
      {
        id: '3',
        name: 'Input.tsx',
        type: 'file',
        icon: '⚛️',
        metadata: { language: 'TypeScript', size: '1.8KB' },
      },
      {
        id: '4',
        name: 'styles.css',
        type: 'file',
        icon: '🎨',
        metadata: { language: 'CSS', size: '3.2KB' },
      },
    ],
  },
  {
    id: '5',
    name: 'Backend',
    type: 'folder',
    metadata: { department: 'Engineering', count: 3 },
    children: [
      {
        id: '6',
        name: 'server.js',
        type: 'file',
        icon: '🟢',
        metadata: { language: 'JavaScript', size: '5.7KB' },
      },
      {
        id: '7',
        name: 'routes.js',
        type: 'file',
        icon: '🟢',
        metadata: { language: 'JavaScript', size: '2.3KB' },
      },
    ],
  },
  {
    id: '8',
    name: 'README.md',
    type: 'file',
    icon: '📖',
    metadata: { language: 'Markdown', size: '1.2KB' },
  },
];
