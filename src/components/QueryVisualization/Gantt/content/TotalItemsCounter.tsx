type TotalItemsCounterProps = {
  levelType: string;
  itemCount: number;
};

export default function TotalItemsCounterProps(props: TotalItemsCounterProps) {
  const { levelType, itemCount } = props;

  return (
    <h5 className='text-sm font-semibold mb-2 text-gray-300'>
      {levelType} ({itemCount} items)
    </h5>
  );
}
