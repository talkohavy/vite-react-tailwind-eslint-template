import type { TreeNode } from '../../../../../../components/TreeView';

type CustomNodeFolderProps = {
  node: TreeNode;
};

export default function CustomNodeFolder(props: CustomNodeFolderProps) {
  const { node } = props;

  return (
    <div className='flex items-center p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-md border border-emerald-200 dark:border-emerald-800 mb-1'>
      <span className='text-emerald-600 dark:text-emerald-400 mr-3'>📁</span>

      <div className='flex-1'>
        <span className='font-bold text-emerald-800 dark:text-emerald-300'>{node.name}</span>

        <div className='flex items-center gap-2 mt-1'>
          <span className='text-xs text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-800/50 px-2 py-1 rounded'>
            {node.metadata!.department}
          </span>

          <span className='text-xs text-gray-500 dark:text-gray-400'>{node.metadata!.count} files</span>
        </div>
      </div>
    </div>
  );
}
