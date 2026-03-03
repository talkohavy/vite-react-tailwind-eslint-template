import clsx from 'clsx';

type LineOfCodeProps = {
  text: string;
  className?: string;
};

export default function LineOfCode(props: LineOfCodeProps) {
  const { text, className } = props;

  return (
    <code className={clsx('rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-700 text-gray-100', className)}>{text}</code>
  );
}
