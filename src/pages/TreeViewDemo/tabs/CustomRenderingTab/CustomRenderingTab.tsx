import TreeView, { type TreeNode } from '../../../../components/TreeView';
import { customTreeData } from '../../logic/constants';
import Legend from './content/Legend';
import MyCustomNode from './content/MyCustomNode/MyCustomNode';

export default function CustomRenderingTab() {
  function handleNodeClick(node: TreeNode) {
    console.log('Selected custom node:', node);
  }

  return (
    <div className='p-6'>
      {/* Header */}
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2'>Custom Rendering</h2>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* TreeView Demo */}
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>Interactive Demo</h3>
          <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
            Custom rendering for React components (blue), JavaScript files (yellow), CSS files (purple), and folders
            (green).
          </p>

          <TreeView
            data={customTreeData}
            onNodeClick={handleNodeClick}
            renderNode={MyCustomNode}
            className='max-h-96 overflow-auto'
          />
        </div>

        <Legend />
      </div>
    </div>
  );
}
