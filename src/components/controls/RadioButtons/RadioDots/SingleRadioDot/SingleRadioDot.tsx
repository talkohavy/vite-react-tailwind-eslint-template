export default function SingleRadioDot() {
  return (
    <div className='relative flex justify-center items-center bg-neutral-500 group-has-[input:checked]/radioWrapper:bg-blue-500 group-has-[input:focus:not(:checked)]/radioWrapper:border-blue-400 group-has-[input:focus:not(:checked)]/radioWrapper:bg-slate-300 group-has-[input:hover:not(:disabled)]/radioWrapper:bg-blue-400 group-has-[input:disabled]/radioWrapper:bg-neutral-400 group-has-[input:disabled]/radioWrapper:opacity-40 size-8 cursor-pointer rounded-full border border-black'>
      <div className='invisible transition-all duration-300 size-4 opacity-0 group-has-[input:checked]/radioWrapper:visible group-has-[input:checked]/radioWrapper:opacity-100 translate-x-half translate-y-half rounded-full bg-white' />
    </div>
  );
}
