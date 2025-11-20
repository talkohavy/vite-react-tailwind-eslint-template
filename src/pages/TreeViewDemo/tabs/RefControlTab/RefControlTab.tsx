import { useRef, useState } from 'react';
import CodeBlock from '../../../../components/CodeBlock';
import Button from '../../../../components/controls/Button';
import TreeView, { type TreeNode, type TreeViewRef } from '../../../../components/TreeView';
import { staticTreeData } from '../../logic/constants';

export default function RefControlTab() {
  const treeRef = useRef<TreeViewRef>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | number | null>(null);
  const [treeDataState, setTreeDataState] = useState<TreeNode[] | null>(null);

  async function handleExpandNode(nodeId: string) {
    await treeRef.current?.expandNode(nodeId);
  }

  function handleCollapseNode(nodeId: string) {
    treeRef.current?.collapseNode(nodeId);
  }

  function handleSelectNode(nodeId: string) {
    treeRef.current?.selectNode(nodeId);
  }

  function handleExpandAll() {
    treeRef.current?.expandAll();
  }

  function handleCollapseAll() {
    treeRef.current?.collapseAll();
  }

  function handleGetTreeData() {
    const data = treeRef.current?.getTreeData();
    setTreeDataState(data || null);
    console.log('Current tree data:', data);
  }

  function handleGetSelectedNodeId() {
    const id = treeRef.current?.getSelectedNodeId();
    setSelectedNodeId(id || null);
    console.log('Currently selected node ID:', id);
  }

  function handleNodeClick(node: TreeNode) {
    console.log('Node clicked:', node);
  }

  function handleSelectedNodeIdChange(nodeId: string | number) {
    console.log('Selected node changed to:', nodeId);
  }

  return (
    <div className='p-6'>
      <div className='mb-6'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2'>Ref Control Demo</h2>

        <p className='text-gray-600 dark:text-gray-400'>
          Demonstrate programmatic control of the TreeView using the ref API
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* TreeView Demo */}
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>TreeView Component</h3>
          <TreeView
            reference={treeRef}
            initialState={staticTreeData}
            onNodeClick={handleNodeClick}
            onSelectedNodeIdChange={handleSelectedNodeIdChange}
            className='max-h-96 overflow-auto border border-gray-300 dark:border-gray-600 p-4 rounded'
            showIcons
            shouldExpandOnClick={false}
          />
        </div>

        {/* Control Panel */}
        <div className='bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>Control Panel</h3>

          <div className='space-y-6'>
            {/* Expand/Collapse All */}
            <div>
              <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Expand/Collapse All</h4>
              <div className='flex gap-2'>
                <Button
                  onClick={handleExpandAll}
                  className='px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded'
                >
                  Expand All
                </Button>

                <Button
                  onClick={handleCollapseAll}
                  className='px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded'
                >
                  Collapse All
                </Button>
              </div>
            </div>

            {/* Expand/Collapse Specific Nodes */}
            <div>
              <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Expand/Collapse Specific</h4>

              <div className='flex flex-col gap-2'>
                <div className='flex gap-2'>
                  <Button
                    onClick={() => handleExpandNode('1')}
                    className='flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm'
                  >
                    Expand "src"
                  </Button>

                  <Button
                    onClick={() => handleCollapseNode('1')}
                    className='flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm'
                  >
                    Collapse "src"
                  </Button>
                </div>

                <div className='flex gap-2'>
                  <Button
                    onClick={() => handleExpandNode('2')}
                    className='flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm'
                  >
                    Expand "components"
                  </Button>

                  <Button
                    onClick={() => handleCollapseNode('2')}
                    className='flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm'
                  >
                    Collapse "components"
                  </Button>
                </div>
              </div>
            </div>

            {/* Select Specific Nodes */}
            <div>
              <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Select Node</h4>
              <div className='grid grid-cols-2 gap-2'>
                <Button
                  onClick={() => handleSelectNode('3')}
                  className='px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm'
                >
                  Select "Button.tsx"
                </Button>

                <Button
                  onClick={() => handleSelectNode('7')}
                  className='px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm'
                >
                  Select "Home.tsx"
                </Button>

                <Button
                  onClick={() => handleSelectNode('14')}
                  className='px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm'
                >
                  Select "package.json"
                </Button>

                <Button
                  onClick={() => handleSelectNode('15')}
                  className='px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm'
                >
                  Select "README.md"
                </Button>
              </div>
            </div>

            {/* Get State */}
            <div>
              <h4 className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Get State</h4>

              <div className='flex gap-2'>
                <Button
                  onClick={handleGetSelectedNodeId}
                  className='w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded'
                >
                  Get Selected Node ID
                </Button>

                <Button
                  onClick={handleGetTreeData}
                  className='w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded'
                >
                  Get Tree Data
                </Button>
              </div>
            </div>

            {/* State Display */}
            {selectedNodeId !== null && (
              <div className='p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800'>
                <p className='text-sm font-medium text-gray-700 dark:text-gray-300'>Selected Node ID:</p>

                <p className='text-sm text-gray-600 dark:text-gray-400 font-mono'>{selectedNodeId}</p>
              </div>
            )}

            {treeDataState && (
              <div className='p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800'>
                <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>Tree Data Retrieved</p>
                <p className='text-xs text-gray-600 dark:text-gray-400'>Check console for full data</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className='mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700'>
        <h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4'>Code Example</h3>
        <CodeBlock
          language='typescript'
          code={`import { useRef } from 'react';
import TreeView, { type TreeViewRef } from './TreeView';

function MyComponent() {
  const treeRef = useRef<TreeViewRef>(null);

  return (
    <>
      <TreeView
        reference={treeRef}
        initialState={data}
        showIcons
      />
      
      {/* Control buttons */}
      <button onClick={() => treeRef.current?.expandAll()}>
        Expand All
      </button>
      
      <button onClick={() => treeRef.current?.collapseAll()}>
        Collapse All
      </button>
      
      <button onClick={async () => {
        // expandNode is async - it loads children if needed
        await treeRef.current?.expandNode('node-id');
      }}>
        Expand Specific Node
      </button>
      
      <button onClick={() => treeRef.current?.selectNode('node-id')}>
        Select Node
      </button>
      
      {/* Get current state */}
      <button onClick={() => {
        const selectedId = treeRef.current?.getSelectedNodeId();
        const treeData = treeRef.current?.getTreeData();
        console.log(selectedId, treeData);
      }}>
        Get State
      </button>
    </>
  );
}`}
        />
      </div>
    </div>
  );
}
