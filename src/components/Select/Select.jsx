import clsx from 'clsx';

/**
 * @typedef {{value: string | number, label: import('react').ReactNode}} Option
 */

/**
 * @param {{
 *   selectedOption: Option,
 *   setOption: any,
 *   options: Array<Option>,
 *   className?: string
 * }} props
 */
export default function Select({ selectedOption, setOption, options, className }) {
  return (
    <select
      value={selectedOption.value}
      onChange={(e) => {
        const selectedValue = e.target.value;
        const selectedOption = options.find((option) => option.value.toString() === selectedValue.toString());
        setOption(selectedOption);
      }}
      className={clsx(
        'h-8 cursor-pointer rounded-md border p-1 hover:border-blue-400 focus:border-blue-600',
        className,
      )}
    >
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
