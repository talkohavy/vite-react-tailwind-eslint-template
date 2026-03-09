import{P as t,w as o}from"./index.B8AALybY.js";import"./RightArrow.sCMnm3RK.js";import{r as s}from"./constants.Bs1BpDRO.js";import{t as d}from"./TreeView.DcD5AAAq.js";var e=t(o());function i(){return(0,e.jsxs)("div",{className:"bg-gray-50 dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-700",children:[(0,e.jsx)("h3",{className:"text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4",children:"Code Example"}),(0,e.jsx)("pre",{className:"text-sm overflow-x-auto",children:(0,e.jsx)("code",{className:"text-gray-800 dark:text-gray-200",children:`const treeData = [
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
  initialState={treeData}
  onNodeClick={(node) => {
    console.log('Selected:', node);
  }}
/>`})})]})}function x(){function r(a){console.log("Selected node:",a)}return(0,e.jsxs)("div",{className:"p-6",children:[(0,e.jsx)("div",{className:"mb-6",children:(0,e.jsx)("h2",{className:"text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2",children:"Static Configuration"})}),(0,e.jsxs)("div",{className:"grid grid-cols-1 lg:grid-cols-2 gap-6",children:[(0,e.jsx)("div",{className:"bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700",children:(0,e.jsx)(d,{initialState:s,onNodeClick:r,className:"max-h-96 overflow-auto",showIcons:!0,shouldExpandOnClick:!0})}),(0,e.jsx)(i,{})]})]})}export{x as default};

//# sourceMappingURL=StaticTreeTab.Cwn_vgpO.js.map