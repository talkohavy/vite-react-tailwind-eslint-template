type XAxisProps = {
  queryLength: number;
};

export default function XAxis(props: XAxisProps) {
  const { queryLength } = props;

  if (queryLength === 0) return null;

  return Array.from({ length: queryLength + 1 }, (_, i) => {
    const pos = (i / queryLength) * 100;
    return (
      <div key={i} className='absolute top-0 bottom-0 w-px bg-gray-600 opacity-30' style={{ left: `${pos}%` }}>
        <span className='absolute top-full text-xs text-gray-500 transform -translate-x-1/2'>{i}</span>
      </div>
    );
  });
}
