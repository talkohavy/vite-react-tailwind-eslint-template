type OriginalQueryDisplayerProps = {
  query: string;
};

export default function OriginalQueryDisplayer(props: OriginalQueryDisplayerProps) {
  const { query } = props;

  return (
    <div className='mb-6 p-4 bg-gray-800 rounded'>
      <h4 className='text-sm font-semibold mb-2 text-gray-300'>Original Query:</h4>

      <div className='font-mono text-sm bg-gray-700 p-2 rounded'>
        {query.split('').map((char, index) => (
          <span key={index} className='relative group'>
            {char === ' ' ? '·' : char}
          </span>
        ))}
      </div>
    </div>
  );
}
