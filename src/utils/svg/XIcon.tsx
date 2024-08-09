type XIconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
  onClick?: (e: any) => void;
  title?: string;
  className?: string;
};

export default function XIcon(props: XIconProps) {
  const { size = 100, color, strokeWidth = 10, className, onClick, title = 'x icon', ...rest } = props;

  return (
    <svg
      width={size}
      height={size}
      stroke={color ?? 'currentColor'}
      viewBox='0 0 100 100'
      className={className}
      onClick={onClick}
      {...rest}
    >
      <title>{title}</title>
      <path fill='none' strokeWidth={strokeWidth} strokeLinecap='round' d='M 20 20 , L 80 80' />
      <path fill='none' strokeWidth={strokeWidth} strokeLinecap='round' d='M80 20 , L 20 80' />
    </svg>
  );
}
