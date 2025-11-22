import ImportSvgAsDefault from './content/ImportSvgAsDefault';
import ImportAsReactComponent from './content/ImportSvgAsReactComponent';
import ImportSvgAsUrl from './content/ImportSvgAsUrl';

export default function SvgImports() {
  return (
    <div className='size-full flex flex-col gap-8 p-8 overflow-auto'>
      <h1 className='text-3xl font-bold'>SVG Import Methods in Vite + React</h1>

      <div className='flex flex-col gap-6'>
        <div>
          <h2 className='text-2xl font-semibold mb-4'>TLDR;</h2>

          <ul className='list-disc pl-8 text-lg'>
            <li>You can always import an svg using method 1.</li>
            <li>You can either use method 2 or method 3, but not both at the same time.</li>
            <li>
              `exportType: 'named'`, would allow the use of:
              <br />
              <code className='text-purple-500'>{`import { ReactComponent as ViteIconComponent } from '../../../../assets/vite2.svg';`}</code>
            </li>
            <li>
              `exportType: 'default'`, would allow the use of:
              <br />
              <code className='text-purple-500'>{`import ViteIconUrl from '../../../../assets/vite2.svg';`}</code>
            </li>
          </ul>
        </div>

        <ImportSvgAsUrl />

        <ImportAsReactComponent />

        <ImportSvgAsDefault />
      </div>
    </div>
  );
}
