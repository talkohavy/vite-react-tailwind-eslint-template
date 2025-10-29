import TreeView, { type TreeNode } from '../../../../components/TreeView';
import { staticTreeData } from '../../logic/constants';
import StaticCodeExample from './content/StaticCodeExample';

export default function StaticTreeTab() {
  function handleNodeClick(node: TreeNode) {
    console.log('Selected node:', node);
  }

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2'>Static Configuration</h2>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* TreeView Demo */}
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
          <TreeView
            data={staticTreeData}
            onNodeClick={handleNodeClick}
            className='max-h-96 overflow-auto'
            expandOnClick
            // indentSize={10}
            // showIcons
          />
        </div>

        <StaticCodeExample />
      </div>
    </div>
  );
}
