type CheckboxProps = {
  isChecked: boolean;
  setIsChecked: (value: any) => void;
  disabled?: boolean;
  label?: string;
};

export default function Checkbox(props: CheckboxProps) {
  const { isChecked, setIsChecked, disabled, label } = props;

  return (
    <button type='button' role='switch' aria-checked={isChecked ? 'true' : 'false'}>
      <label className='group flex cursor-pointer items-center justify-center gap-2'>
        <div className='flex items-center justify-center'>
          <input
            type='checkbox'
            // value={isChecked} // <--- apparently you don't need value in a checkbox
            checked={!!isChecked}
            onChange={setIsChecked}
            disabled={disabled}
            aria-hidden='true'
            tabIndex={-1}
            className='size-0 opacity-0 pointer-events-none'
          />

          <div className='size-6 rounded-md border border-black group-has-[input:checked]:bg-blue-400' />
        </div>

        <div>{label}</div>
      </label>
    </button>
  );
}
