declare module '*.svg' {
  // 1. When importing svg as src inside an img:
  // const content: React.FC<React.SVGProps<SVGElement>>;
  // export default content;

  // 2. When importing svg as ReactComponent:
  import type React from 'react';
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export { ReactComponent };
  export default ReactComponent;
}

interface ImportMetaEnv {
  [key: string]: any;
  BASE_URL: string;
  MODE: string;
  DEV: boolean;
  PROD: boolean;
  SSR: boolean;
}

interface ImportMeta {
  url: string;

  readonly env: ImportMetaEnv;
}

declare module '*.css' {
  const content: Record<string, string>;
  export default content;
}

declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare module '@tailwindcss/vite' {
  function tailwindcss(options?: any): any;
  export default tailwindcss;
}
