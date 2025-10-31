import { useState } from 'react';
import TreeView, { type TreeNode } from '../../../../components/TreeView';
import Legend from './content/Legend';
import MyCustomNode from './content/MyCustomNode/MyCustomNode';

// Initial tree data - folders will load dynamically
const initialTreeData: Array<TreeNode> = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    metadata: { department: 'Source Code', count: 0 },
  },
  {
    id: '2',
    name: 'public',
    type: 'folder',
    metadata: { department: 'Assets', count: 0 },
  },
  {
    id: '3',
    name: 'package.json',
    type: 'file',
    metadata: { language: 'JSON', size: '1.2KB' },
  },
];

// Simulate async data loading for different folders
function simulateLoadChildren(nodeId: string): Promise<Array<TreeNode>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const childrenMap: Record<string, Array<TreeNode>> = {
        '1': [
          {
            id: '1-1',
            name: 'components',
            type: 'folder',
            metadata: { department: 'UI Components', count: 0 },
          },
          {
            id: '1-2',
            name: 'pages',
            type: 'folder',
            metadata: { department: 'Pages', count: 0 },
          },
          {
            id: '1-3',
            name: 'App.tsx',
            type: 'file',
            metadata: { language: 'TypeScript', size: '2.3KB' },
          },
          {
            id: '1-4',
            name: 'index.css',
            type: 'file',
            metadata: { language: 'CSS', size: '1.8KB' },
          },
        ],
        '2': [
          {
            id: '2-1',
            name: 'favicon.ico',
            type: 'file',
            metadata: { language: 'Image', size: '4.2KB' },
          },
          {
            id: '2-2',
            name: 'manifest.json',
            type: 'file',
            metadata: { language: 'JSON', size: '0.8KB' },
          },
        ],
        '1-1': [
          {
            id: '1-1-1',
            name: 'Button.tsx',
            type: 'file',
            metadata: { language: 'TypeScript', size: '3.1KB' },
          },
          {
            id: '1-1-2',
            name: 'Input.tsx',
            type: 'file',
            metadata: { language: 'TypeScript', size: '2.7KB' },
          },
          {
            id: '1-1-3',
            name: 'Modal.tsx',
            type: 'file',
            metadata: { language: 'TypeScript', size: '4.5KB' },
          },
          {
            id: '1-1-4',
            name: 'styles.css',
            type: 'file',
            metadata: { language: 'CSS', size: '2.1KB' },
          },
        ],
        '1-2': [
          {
            id: '1-2-1',
            name: 'Home.tsx',
            type: 'file',
            metadata: { language: 'TypeScript', size: '5.2KB' },
          },
          {
            id: '1-2-2',
            name: 'About.tsx',
            type: 'file',
            metadata: { language: 'TypeScript', size: '3.8KB' },
          },
          {
            id: '1-2-3',
            name: 'utils.js',
            type: 'file',
            metadata: { language: 'JavaScript', size: '2.9KB' },
          },
        ],
      };

      resolve(childrenMap[nodeId] || []);
    }, 800); // Simulate network delay
  });
}

export default function CustomRenderingTab() {
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

  function handleNodeClick(node: TreeNode) {
    setSelectedNode(node);
    console.log('Selected custom node:', node);
  }

  async function handleNodeExpand(node: TreeNode) {
    console.log('Expanding node:', node.name);
    const children = await simulateLoadChildren(node.id);
    return children;
  }

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2'>Custom Rendering</h2>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          Explore custom node rendering with dynamic loading, expandable folders, and interactive selections.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* TreeView Demo */}
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>Interactive Demo</h3>
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
            Click folders to expand and load children dynamically. Custom rendering for React components (blue),
            JavaScript files (yellow), CSS files (purple), and folders (green).
          </p>

          <TreeView
            initialState={initialTreeData}
            onNodeClick={handleNodeClick}
            onNodeExpand={handleNodeExpand}
            renderNode={MyCustomNode}
            className='max-h-96 overflow-auto'
          />

          {/* Selected Node Info */}
          {selectedNode && (
            <div className='mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600'>
              <h4 className='text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2'>Selected Node:</h4>
              <div className='text-xs text-gray-600 dark:text-gray-300 space-y-1'>
                <div>
                  <strong>Name:</strong> {selectedNode.name}
                </div>
                <div>
                  <strong>Type:</strong> {selectedNode.type}
                </div>
                {selectedNode.metadata && (
                  <div>
                    <strong>Metadata:</strong> {JSON.stringify(selectedNode.metadata)}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Legend />
      </div>
    </div>
  );
}
