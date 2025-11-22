/// <reference types="vite/client" />

declare module '*.svg' {
  // 1. When config is set to: exportType: 'default':
  // const content: React.FC<React.SVGProps<SVGElement>>;
  // export default content;

  // 2. When config is set to: exportType: 'named':
  import type React from 'react';
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  // biome-ignore lint: ambient module type declaration
  export { ReactComponent };
  export default ReactComponent;
}
