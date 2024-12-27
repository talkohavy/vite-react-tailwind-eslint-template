type VMarkV2Props = {
  className?: string;
};

export default function VMarkV2(props: VMarkV2Props) {
  const { className } = props;

  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      version='1.1'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path d='M3,12.5l7,7L21,5' />
    </svg>
  );
}
