import{P as c,j as N,w as y}from"./index.DelqeHV3.js";import"./bundle-mjs._MF_IAgM.js";import{t as r}from"./Button.0uQVDOlP.js";import"./Button.CcVGIxun.js";import{t as j}from"./CodeBlock.BTomf812.js";import"./RightArrow.DLFqYTkm.js";import{r as k}from"./constants.Dj9bpPsf.js";import{t as C}from"./TreeView.SuIxKALU.js";var d=c(N()),e=c(y());function A(){const l=(0,d.useRef)(null),[n,i]=(0,d.useState)(null),[x,g]=(0,d.useState)(null);async function s(t){await l.current?.expandNode(t)}function o(t){l.current?.collapseNode(t)}function a(t){l.current?.selectNode(t)}function m(){l.current?.expandAll()}function p(){l.current?.collapseAll()}function u(){const t=l.current?.getTreeData();g(t||null),console.log("Current tree data:",t)}function h(){const t=l.current?.getSelectedNodeId();i(t||null),console.log("Currently selected node ID:",t)}function b(t){console.log("Node clicked:",t)}function f(t){console.log("Selected node changed to:",t)}return(0,e.jsxs)("div",{className:"p-6",children:[(0,e.jsxs)("div",{className:"mb-6",children:[(0,e.jsx)("h2",{className:"text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2",children:"Ref Control Demo"}),(0,e.jsx)("p",{className:"text-gray-600 dark:text-gray-400",children:"Demonstrate programmatic control of the TreeView using the ref API"})]}),(0,e.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[(0,e.jsxs)("div",{className:"bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700",children:[(0,e.jsx)("h3",{className:"text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4",children:"TreeView Component"}),(0,e.jsx)(C,{reference:l,initialState:k,onNodeClick:b,onSelectedNodeIdChange:f,className:"max-h-96 overflow-auto border border-gray-300 dark:border-gray-600 p-4 rounded",showIcons:!0,shouldExpandOnClick:!1})]}),(0,e.jsxs)("div",{className:"bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700",children:[(0,e.jsx)("h3",{className:"text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4",children:"Control Panel"}),(0,e.jsxs)("div",{className:"space-y-6",children:[(0,e.jsxs)("div",{children:[(0,e.jsx)("h4",{className:"text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Expand/Collapse All"}),(0,e.jsxs)("div",{className:"flex gap-2",children:[(0,e.jsx)(r,{onClick:m,className:"px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded",children:"Expand All"}),(0,e.jsx)(r,{onClick:p,className:"px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded",children:"Collapse All"})]})]}),(0,e.jsxs)("div",{children:[(0,e.jsx)("h4",{className:"text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Expand/Collapse Specific"}),(0,e.jsxs)("div",{className:"flex flex-col gap-2",children:[(0,e.jsxs)("div",{className:"flex gap-2",children:[(0,e.jsx)(r,{onClick:()=>s("1"),className:"flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm",children:'Expand "src"'}),(0,e.jsx)(r,{onClick:()=>o("1"),className:"flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm",children:'Collapse "src"'})]}),(0,e.jsxs)("div",{className:"flex gap-2",children:[(0,e.jsx)(r,{onClick:()=>s("2"),className:"flex-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded text-sm",children:'Expand "components"'}),(0,e.jsx)(r,{onClick:()=>o("2"),className:"flex-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded text-sm",children:'Collapse "components"'})]})]})]}),(0,e.jsxs)("div",{children:[(0,e.jsx)("h4",{className:"text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Select Node"}),(0,e.jsxs)("div",{className:"grid grid-cols-2 gap-2",children:[(0,e.jsx)(r,{onClick:()=>a("3"),className:"px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm",children:'Select "Button.tsx"'}),(0,e.jsx)(r,{onClick:()=>a("7"),className:"px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm",children:'Select "Home.tsx"'}),(0,e.jsx)(r,{onClick:()=>a("14"),className:"px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm",children:'Select "package.json"'}),(0,e.jsx)(r,{onClick:()=>a("15"),className:"px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded text-sm",children:'Select "README.md"'})]})]}),(0,e.jsxs)("div",{children:[(0,e.jsx)("h4",{className:"text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Get State"}),(0,e.jsxs)("div",{className:"flex gap-2",children:[(0,e.jsx)(r,{onClick:h,className:"w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded",children:"Get Selected Node ID"}),(0,e.jsx)(r,{onClick:u,className:"w-full px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded",children:"Get Tree Data"})]})]}),n!==null&&(0,e.jsxs)("div",{className:"p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800",children:[(0,e.jsx)("p",{className:"text-sm font-medium text-gray-700 dark:text-gray-300",children:"Selected Node ID:"}),(0,e.jsx)("p",{className:"text-sm text-gray-600 dark:text-gray-400 font-mono",children:n})]}),x&&(0,e.jsxs)("div",{className:"p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800",children:[(0,e.jsx)("p",{className:"text-sm font-medium text-gray-700 dark:text-gray-300 mb-2",children:"Tree Data Retrieved"}),(0,e.jsx)("p",{className:"text-xs text-gray-600 dark:text-gray-400",children:"Check console for full data"})]})]})]})]}),(0,e.jsxs)("div",{className:"mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700",children:[(0,e.jsx)("h3",{className:"text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4",children:"Code Example"}),(0,e.jsx)(j,{language:"typescript",code:`import { useRef } from 'react';
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
}`})]})]})}export{A as default};

//# sourceMappingURL=RefControlTab.BJZftsOG.js.map