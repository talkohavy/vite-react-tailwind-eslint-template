type CloseIconProps = {
  color?: string;
  title?: string;
  className?: string;
};

export default function CloseIcon(props: CloseIconProps) {
  const { color = 'currentColor', className, title = '' } = props;

  return (
    <svg
      viewBox='0 0 100 100'
      strokeWidth={8}
      stroke={color}
      strokeLinecap='round'
      xmlns='http://www.w3.org/2000/svg'
      className={className}
    >
      <title>{title}</title>

      <line x1='20' y1='20' x2='80' y2='80' />
      <line x1='20' y1='80' x2='80' y2='20' />
    </svg>
  );
}
