type CalendarIconProps = {
  className?: string;
};

export default function CalendarIcon(props: CalendarIconProps) {
  const { className } = props;

  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      stroke-width='2'
      stroke-linecap='round'
      stroke-linejoin='round'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <path d='M8 2v4'></path>
      <path d='M16 2v4'></path>
      <rect width='18' height='18' x='3' y='4' rx='2' />
      <path d='M3 10h18'></path>
    </svg>
  );
}
