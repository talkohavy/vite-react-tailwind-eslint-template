import type { TreeNode } from '../../../../../../components/TreeView';

type CustomNodeJavascriptFileProps = {
  node: TreeNode;
};

export default function CustomNodeJavascriptFile(props: CustomNodeJavascriptFileProps) {
  const { node } = props;

  return (
    <div className='flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800 mb-1'>
      <span className='text-yellow-600 dark:text-yellow-400 mr-3'>🟢</span>

      <div className='flex-1'>
        <span className='font-semibold text-yellow-800 dark:text-yellow-300'>{node.name}</span>

        {node.metadata && (
          <div className='flex items-center gap-2 mt-1'>
            <span className='text-xs text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-800/50 px-2 py-1 rounded'>
              Node.js
            </span>

            <span className='text-xs text-gray-500 dark:text-gray-400'>{node.metadata.size}</span>
          </div>
        )}
      </div>
    </div>
  );
}
