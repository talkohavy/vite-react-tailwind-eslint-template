import TreeView, { type TreeNode } from '../../../../components/TreeView';
import { staticTreeData } from '../../logic/constants';

export default function StaticTreeTab() {
  function handleNodeClick(node: TreeNode) {
    console.log('Selected node:', node);
  }

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2'>Static Configuration</h2>
        <p className='text-gray-600 dark:text-gray-400'>
          Tree structure is known upfront with all children defined. Perfect for file explorers, organization charts, or
          any hierarchical data that doesn't change.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* TreeView Demo */}
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>Interactive Demo</h3>
          <TreeView data={staticTreeData} onNodeClick={handleNodeClick} className='max-h-96 overflow-auto' />
        </div>

        {/* Code Example */}
        <div className='bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>Code Example</h3>
          <pre className='text-sm overflow-x-auto'>
            <code className='text-gray-800 dark:text-gray-200'>{`const treeData = [
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
          { 
            id: '3', 
            name: 'Button.tsx', 
            type: 'file', 
            icon: '⚛️' 
          },
          // ... more files
        ],
      },
      // ... more folders
    ],
  },
];

<TreeView
  data={treeData}
  onNodeClick={(node) => {
    console.log('Selected:', node);
  }}
/>`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
