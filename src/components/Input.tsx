export default function Input({ value, setValue, placeholder = '' }) {
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className='h-10 w-72 rounded-md border border-black p-2'
      placeholder={placeholder}
    />
  );
}
