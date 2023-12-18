/**
 * @param {{
 *    size?: number,
 *    color?: string,
 *    strokeWidth?: number,
 *    className?: string,
 *    onClick?: (e: any) => void,
 * }} props
 */
export default function XIcon({ size = 100, color, strokeWidth = 10, className, onClick, ...rest }) {
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
      <path fill='none' strokeWidth={strokeWidth} strokeLinecap='round' d='M 20 20 , L 80 80'></path>
      <path fill='none' strokeWidth={strokeWidth} strokeLinecap='round' d='M80 20 , L 20 80'></path>
    </svg>
  );
}
