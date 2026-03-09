import{C as s,P as o,w as r}from"./index.B8AALybY.js";import{t}from"./CodeBlock.BsNYkESk.js";var e=o(r());function l(){return(0,e.jsxs)("section",{className:"border border-gray-300 dark:border-gray-700 rounded-lg p-6",children:[(0,e.jsx)("h2",{className:"text-2xl font-semibold mb-4",children:"Method 3: Import as React Component Directly (Default Export)"}),(0,e.jsxs)("div",{className:"flex flex-col gap-4",children:[(0,e.jsx)(t,{code:"import ViteIconUrl from '../../../../assets/vite2.svg';"}),(0,e.jsx)("p",{className:"text-blue-500",children:"Configuration is currently set to `exportType: 'default'`, so we can't see the SVG. Hence you see this line instead."}),(0,e.jsx)("p",{children:"For this code to work you need to change the `svgrOptions` in the `vite.config.ts` file to:"}),(0,e.jsx)(t,{code:`import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => ({
  plugins: [
    svgr({
      include: '**/*.svg',
      svgrOptions: {
        exportType: 'default',
      },
    }),
  ],
}));
`}),(0,e.jsxs)("p",{children:["It would also mean that the import style of"," ",(0,e.jsx)("code",{className:"text-purple-500",children:"import { ReactComponent as ViteIconComponent } from '../../../../assets/vite2.svg';"})," ",(0,e.jsx)("strong",{className:"text-red-500",children:"would stop working!"}),"."]})]})]})}function i(){return(0,e.jsxs)("section",{className:"border border-gray-300 dark:border-gray-700 rounded-lg p-6",children:[(0,e.jsx)("h2",{className:"text-2xl font-semibold mb-4",children:"Method 2: Import as React Component"}),(0,e.jsxs)("div",{className:"flex flex-col gap-4",children:[(0,e.jsx)(t,{code:"import { ReactComponent as ViteIconComponent } from '../../../../assets/vite2.svg';"}),(0,e.jsx)(s,{className:"w-24 h-24"}),(0,e.jsx)("p",{children:"For this code to work you need to change the `svgrOptions` in the `vite.config.ts` file to:"}),(0,e.jsx)(t,{code:`import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => ({
  plugins: [
    svgr({
      include: '**/*.svg',
      svgrOptions: {
        exportType: 'named',
      },
    }),
  ],
}));
`}),(0,e.jsxs)("p",{children:["It would also mean that the import style of"," ",(0,e.jsx)("code",{className:"text-purple-500",children:"import ViteIconUrl from '../../../../assets/vite2.svg';"})," ",(0,e.jsx)("strong",{className:"text-red-500",children:"would stop working!"})]})]})]})}var c="data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20aria-hidden='true'%20role='img'%20class='iconify%20iconify--logos'%20width='31.88'%20height='32'%20preserveAspectRatio='xMidYMid%20meet'%20viewBox='0%200%20256%20257'%3e%3cdefs%3e%3clinearGradient%20id='IconifyId1813088fe1fbc01fb466'%20x1='-.828%25'%20x2='57.636%25'%20y1='7.652%25'%20y2='78.411%25'%3e%3cstop%20offset='0%25'%20stop-color='%2341D1FF'%3e%3c/stop%3e%3cstop%20offset='100%25'%20stop-color='%23BD34FE'%3e%3c/stop%3e%3c/linearGradient%3e%3clinearGradient%20id='IconifyId1813088fe1fbc01fb467'%20x1='43.376%25'%20x2='50.316%25'%20y1='2.242%25'%20y2='89.03%25'%3e%3cstop%20offset='0%25'%20stop-color='%23FFEA83'%3e%3c/stop%3e%3cstop%20offset='8.333%25'%20stop-color='%23FFDD35'%3e%3c/stop%3e%3cstop%20offset='100%25'%20stop-color='%23FFA800'%3e%3c/stop%3e%3c/linearGradient%3e%3c/defs%3e%3cpath%20fill='url(%23IconifyId1813088fe1fbc01fb466)'%20d='M255.153%2037.938L134.897%20252.976c-2.483%204.44-8.862%204.466-11.382.048L.875%2037.958c-2.746-4.814%201.371-10.646%206.827-9.67l120.385%2021.517a6.537%206.537%200%200%200%202.322-.004l117.867-21.483c5.438-.991%209.574%204.796%206.877%209.62Z'%3e%3c/path%3e%3cpath%20fill='url(%23IconifyId1813088fe1fbc01fb467)'%20d='M185.432.063L96.44%2017.501a3.268%203.268%200%200%200-2.634%203.014l-5.474%2092.456a3.268%203.268%200%200%200%203.997%203.378l24.777-5.718c2.318-.535%204.413%201.507%203.936%203.838l-7.361%2036.047c-.495%202.426%201.782%204.5%204.151%203.78l15.304-4.649c2.372-.72%204.652%201.36%204.15%203.788l-11.698%2056.621c-.732%203.542%203.979%205.473%205.943%202.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505%204.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z'%3e%3c/path%3e%3c/svg%3e";function n(){return(0,e.jsxs)("section",{className:"border border-gray-300 dark:border-gray-700 rounded-lg p-6",children:[(0,e.jsx)("h2",{className:"text-2xl font-semibold mb-4",children:"Method 1: Import as URL (Default Export)"}),(0,e.jsxs)("div",{className:"flex flex-col gap-4",children:[(0,e.jsx)(t,{code:"import viteIconUrl from '../../../../assets/vite2.svg?url';"}),(0,e.jsx)("img",{src:c,alt:"Vite Icon",className:"w-24 h-24"}),(0,e.jsx)("p",{children:"This would always work!"}),(0,e.jsx)(t,{code:`import svgr from 'vite-plugin-svgr';

export default defineConfig(({ mode }) => ({
  plugins: [
    svgr({
      include: '**/*.svg',
      svgrOptions: {
        // It would work in this configuration:
        exportType: 'default', // <--- this is actually the default configuration.
        // And it would work in this configuration:
        exportType: 'named',
      },
    }),
  ],
}));
`})]})]})}function p(){return(0,e.jsxs)("div",{className:"size-full flex flex-col gap-8 p-8 overflow-auto",children:[(0,e.jsx)("h1",{className:"text-3xl font-bold",children:"SVG Import Methods in Vite + React"}),(0,e.jsxs)("div",{className:"flex flex-col gap-6",children:[(0,e.jsxs)("div",{children:[(0,e.jsx)("h2",{className:"text-2xl font-semibold mb-4",children:"TLDR;"}),(0,e.jsxs)("ul",{className:"list-disc pl-8 text-lg",children:[(0,e.jsx)("li",{children:"You can always import an svg using method 1."}),(0,e.jsx)("li",{children:"You can either use method 2 or method 3, but not both at the same time."}),(0,e.jsxs)("li",{children:["`exportType: 'named'`, would allow the use of:",(0,e.jsx)("br",{}),(0,e.jsx)("code",{className:"text-purple-500",children:"import { ReactComponent as ViteIconComponent } from '../../../../assets/vite2.svg';"})]}),(0,e.jsxs)("li",{children:["`exportType: 'default'`, would allow the use of:",(0,e.jsx)("br",{}),(0,e.jsx)("code",{className:"text-purple-500",children:"import ViteIconUrl from '../../../../assets/vite2.svg';"})]})]})]}),(0,e.jsx)(n,{}),(0,e.jsx)(i,{}),(0,e.jsx)(l,{})]})]})}export{p as default};

//# sourceMappingURL=SvgImports.BYw1R6xc.js.map