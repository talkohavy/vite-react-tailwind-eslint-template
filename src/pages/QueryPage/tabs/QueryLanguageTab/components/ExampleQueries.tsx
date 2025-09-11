import { examples } from '../logic/constants';

type ExampleQueriesProps = {
  onExampleSelect: (example: string) => void;
};

export default function ExampleQueries(props: ExampleQueriesProps) {
  const { onExampleSelect } = props;

  return (
    <div className='mb-8'>
      <h1 className='text-3xl font-bold text-white mb-4'>Query Language System</h1>

      <p className='text-gray-300 mb-6'>
        Type a query below with intelligent autocomplete. The dropdown will show available keys, values, and operators
        based on context.
      </p>

      <div className='mb-6'>
        <h2 className='text-lg font-semibold text-white mb-3'>Examples:</h2>
        <div className='space-y-2'>
          {examples.map((example, index) => (
            <button
              key={index}
              type='button'
              className='text-sm text-gray-400 font-mono bg-gray-800 p-2 rounded cursor-pointer hover:bg-gray-700 transition-colors text-left w-full'
              onClick={() => onExampleSelect(example)}
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
