type CopyV2Props = {
  className?: string;
};

export default function CopyV2(props: CopyV2Props) {
  const { className } = props;

  return (
    <svg viewBox='0 0 24 24' fill='currentColor' version='1.1' xmlns='http://www.w3.org/2000/svg' className={className}>
      <path d='M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z' />
    </svg>
  );
}
