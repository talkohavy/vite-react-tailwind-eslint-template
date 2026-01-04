import clsx from 'clsx';
import { Severity, type SeverityValues } from './logic/constants';

const STYLE_BY_SEVERITY = {
  [Severity.Low]: 'bg-green-100 text-green-800',
  [Severity.Medium]: 'bg-yellow-100 text-yellow-800',
  [Severity.High]: 'bg-orange-100 text-orange-800',
  [Severity.Critical]: 'bg-red-100 text-red-800',
};

type SeverityBadgeProps = {
  severity: SeverityValues;
};

export default function SeverityBadge(props: SeverityBadgeProps) {
  const { severity } = props;

  return <div className={clsx('p-1 w-fit rounded-md uppercase', STYLE_BY_SEVERITY[severity])}>{severity}</div>;
}
