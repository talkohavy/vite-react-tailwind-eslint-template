import os from 'os';
import { build } from 'esbuild';

/**
 * @typedef {{
 *   version: string,
 *   private?: string | boolean,
 *   main: string,
 *   type: 'module' | 'commonjs'
 *   types: string,
 *   scripts?: Record<string, string>,
 *   publishConfig: {
 *     access: string
 *   },
 *   devDependencies?: Record<string, string>,
 * }} PackageJson
 */

const mode = process.env.NODE_ENV;
const isProd = mode === 'production';
const greenColor = '[32m';
const blueColor = '[34m';
const stopColor = '[39m';

buildPackageConfig();

async function buildPackageConfig() {
  await runBuild();

  console.log(`${os.EOL}${blueColor}DONE !!!${stopColor}${os.EOL}`);
}

async function runBuild() {
  console.log(`${greenColor}- Step 2:${stopColor} build the output dir`);

  await build({
    entryPoints: ['src/lib/ServiceWorker/initServiceWorker.ts'],
    bundle: true,
    outfile: 'src/public/sw.js',
    minify: isProd, // <--- defaults to `false`. should be `true` only in production.
    format: 'esm', // <--- When platform is set to 'node', this defaults to 'cjs'.
    tsconfig: 'tsconfig.json', // <--- Normally the build API automatically discovers tsconfig.json files and reads their contents during a build. However, you can also configure a custom tsconfig.json file to use instead. This can be useful if you need to do multiple builds of the same code with different settings.
    packages: 'external', // <--- You also may not want to bundle your dependencies with esbuild. There are many node-specific features that esbuild doesn't support while bundling such as __dirname, import.meta.url, fs.readFileSync, and *.node native binary modules. You can exclude all of your dependencies from the bundle by setting packages to external. If you do this, your dependencies must still be present on the file system at run-time since they are no longer included in the bundle.
    conditions: [], // <--- If no custom conditions are configured, the Webpack-specific module condition is also included. The module condition is used by package authors to provide a tree-shakable ESM alternative to a CommonJS file without creating a dual package hazard. You can prevent the module condition from being included by explicitly configuring some custom conditions (even an empty list).
    // sourcemap: false, // <--- defaults to `false`. for 'node', create sourcemaps is for development only.
    // platform: 'browser', // <--- defaults to 'browser'. If you're creating a CLI tool, use 'node' value. Setting platform to 'node' is beneficial when for example, all packages that are built-in to node such as fs are automatically marked as external so esbuild doesn't try to bundle them.
    // treeShaking: true, // <--- defaults to `true`. Removes dead code.
    // mainFields: ['main', 'module'], // <--- When platform is set to 'node', this defaults to 'module','main'. When platform is set to 'browser', this defaults to 'browser','module','main'. IMPORTANT! The order matters! 'main', 'module' is not the same as 'module', 'main'! I chose the more risky one, that attempts to tree-shake, but could potentially fail.
    /**
     * Some npm packages you want to use may not be designed to be run in the browser.
     * Sometimes you can use esbuild's configuration options to work around certain issues and successfully
     * bundle the package anyway. Undefined globals can be replaced with either the define feature in
     * simple cases or the inject feature in more complex cases.
     */
    // define :
    // inject :
  });
}
