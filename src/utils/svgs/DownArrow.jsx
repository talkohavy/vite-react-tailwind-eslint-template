export default function DownArrow({ title = 'arrow icon', className = undefined }) {
  return (
    <svg stroke='currentColor' strokeWidth='12' viewBox='0 0 100 100' className={className}>
      <title>{title}</title>
      <line x1='10' y1='30' x2='50' y2='68' strokeLinecap='round' />
      <line x1='50' y1='68' x2='90' y2='30' strokeLinecap='round' />
    </svg>
  );
}
