// @ts-ignore
import viteIconUrl from '../../../../assets/vite2.svg?url';
import CodeBlock from '../../../../components/CodeBlock';

export default function ImportSvgAsUrl() {
  return (
    <section className='border border-gray-300 dark:border-gray-700 rounded-lg p-6'>
      <h2 className='text-2xl font-semibold mb-4'>Method 1: Import as URL (Default Export)</h2>

      <div className='flex flex-col gap-4'>
        <CodeBlock code={`import viteIconUrl from '../../../../assets/vite2.svg?url';`} />

        <img src={viteIconUrl} alt='Vite Icon' className='w-24 h-24' />

        <p>This would always work!</p>

        <CodeBlock
          code={`import svgr from 'vite-plugin-svgr';

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
`}
        />
      </div>
    </section>
  );
}
