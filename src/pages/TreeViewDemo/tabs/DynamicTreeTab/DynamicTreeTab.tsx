import { useState } from 'react';
import TreeView, { type TreeNode } from '../../../../components/TreeView';
import { dynamicTreeData } from '../../logic/constants';
import { mockAsyncLoader } from '../../logic/utils/mockAsyncLoader';
import SelectedNodeInfo from './content/SelectedNodeInfo';

export default function DynamicTreeTab() {
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

  function handleNodeClick(node: TreeNode) {
    setSelectedNode(node);
    console.log('Selected node:', node);
  }

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2'>Dynamic Configuration</h2>
        <p className='text-gray-600 dark:text-gray-400'>
          Tree nodes are loaded asynchronously when expanded. Perfect for large datasets, remote file systems, or any
          scenario where you want to load data on-demand.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* TreeView Demo */}
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>Interactive Demo</h3>

          <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
            Try expanding folders to see loading states and async data loading in action!
          </p>

          <TreeView
            data={dynamicTreeData}
            onNodeClick={handleNodeClick}
            onNodeExpand={mockAsyncLoader}
            className='max-h-96 overflow-auto'
          />
        </div>

        <SelectedNodeInfo selectedNode={selectedNode} />
      </div>

      <div className='mt-8'>
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
          <h4 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>Code Example</h4>
          <pre className='text-sm overflow-x-auto bg-gray-50 dark:bg-gray-900 p-4 rounded'>
            <code className='text-gray-800 dark:text-gray-200'>{`const dynamicData = [
  { id: 'root', name: 'My Project', type: 'folder' },
  { id: 'config', name: 'config.json', type: 'file' },
];

const loadChildren = async (node) => {
  // Simulate API call
  const response = await fetch(\`/api/files/\${node.id}\`);
  return response.json();
};

<TreeView
  data={dynamicData}
  onNodeExpand={loadChildren}
  onNodeClick={(node) => console.log('Selected:', node)}
/>`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
