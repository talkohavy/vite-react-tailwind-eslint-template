import clsx from 'clsx';

const base = 'relative flex justify-center items-center h-8 w-32 rounded-t-md cursor-pointer';
const lightMode =
  'text-gray-700 bg-gray-200 group-has-[input:checked]/radioWrapper:text-white group-has-[input:checked]/radioWrapper:bg-blue-500 group-has-[input:focus:not(:checked)]/radioWrapper:border-blue-400 group-has-[input:hover:not(:disabled)]/radioWrapper:bg-blue-400 group-has-[input:hover:not(:disabled)]/radioWrapper:text-white group-has-[input:disabled]/radioWrapper:bg-gray-400 group-has-[input:disabled]/radioWrapper:opacity-40';
const darkMode = 'dark:text-gray-100 dark:bg-gray-500';

type SingleRadioTabProps = {
  label: string;
};

export default function SingleRadioTab(props: SingleRadioTabProps) {
  const { label } = props;

  return <div className={clsx(base, lightMode, darkMode)}>{label}</div>;
}
