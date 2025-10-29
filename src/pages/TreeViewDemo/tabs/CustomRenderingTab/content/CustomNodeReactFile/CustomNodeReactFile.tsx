import type { TreeNode } from '../../../../../../components/TreeView';

type CustomNodeReactFileProps = {
  node: TreeNode;
};

export default function CustomNodeReactFile(props: CustomNodeReactFileProps) {
  const { node } = props;

  return (
    <div className='flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800 mb-1'>
      <span className='text-blue-600 dark:text-blue-400 mr-3'>⚛️</span>

      <div className='flex-1'>
        <span className='font-semibold text-blue-800 dark:text-blue-300'>node.name</span>node.metadata && (
        <div className='flex items-center gap-2 mt-1'>
          <span className='text-xs text-blue-500 dark:text-blue-400 bg-blue-100 dark:bg-blue-800/50 px-2 py-1 rounded'>
            React Component
          </span>

          <span className='text-xs text-gray-500 dark:text-gray-400'>{node.metadata?.size ?? 'unknown'}</span>
        </div>
        )
      </div>
    </div>
  );
}
