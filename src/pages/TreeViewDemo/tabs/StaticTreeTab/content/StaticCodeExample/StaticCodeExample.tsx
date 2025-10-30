export default function StaticCodeExample() {
  return (
    <div className='bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
      <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>Code Example</h3>
      <pre className='text-sm overflow-x-auto'>
        <code className='text-gray-800 dark:text-gray-200'>{`const treeData = [
  {
    id: '1',
    name: 'src',
    type: 'folder',
    items: [
      {
        id: '2', 
        name: 'components',
        type: 'folder',
        items: [
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
  );
}
