type LineOfCodeProps = {
  text: string;
};

export default function LineOfCode(props: LineOfCodeProps) {
  const { text } = props;

  return <code className='rounded bg-gray-100 px-1 py-0.5 dark:bg-gray-700'>{text}</code>;
}
