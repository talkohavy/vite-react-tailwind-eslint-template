import type { TreeNode } from '../../../../components/TreeView';

// Mock async data loader
export async function mockAsyncLoader(node: TreeNode): Promise<Array<TreeNode>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (node.id === 'root') {
    return [
      {
        id: 'root-src',
        name: 'src',
        type: 'folder',
      },
      {
        id: 'root-tests',
        name: 'tests',
        type: 'folder',
      },
      { id: 'root-app', name: 'App.tsx', type: 'file', icon: '⚛️' },
    ];
  }

  if (node.id === 'docs') {
    return [
      { id: 'docs-readme', name: 'README.md', type: 'file', icon: '📖' },
      { id: 'docs-api', name: 'API.md', type: 'file', icon: '📋' },
      { id: 'docs-guide', name: 'GUIDE.md', type: 'file', icon: '📚' },
    ];
  }

  if (node.id === 'root-src') {
    return [
      { id: 'src-components', name: 'components', type: 'folder' },
      { id: 'src-utils', name: 'utils', type: 'folder' },
      { id: 'src-main', name: 'main.tsx', type: 'file', icon: '⚛️' },
    ];
  }

  if (node.id === 'src-components') {
    return [
      { id: 'comp-button', name: 'Button.tsx', type: 'file', icon: '🔘' },
      { id: 'comp-input', name: 'Input.tsx', type: 'file', icon: '📝' },
      { id: 'comp-tree', name: 'TreeView.tsx', type: 'file', icon: '🌳' },
    ];
  }

  // Return empty array for other nodes
  return [];
}
