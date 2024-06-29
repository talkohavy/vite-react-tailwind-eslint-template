import clsx from 'clsx';
import { Link } from 'react-router-dom';

export default function SideBarLinkItem({ to, text, isActive }) {
  return (
    <Link to={to} className={clsx('text-lg hover:text-red-500 active:text-red-400', isActive && 'font-bold')}>
      {text}
    </Link>
  );
}
