type CustomToastTitleProps = {
  headline?: string;
  subtitle?: string;
};

export default function CustomToastTitle(props: CustomToastTitleProps) {
  const { headline = 'Payment received', subtitle = '$249.00 from Alex Chen' } = props;

  return (
    <div className='flex items-center gap-3'>
      <div className='flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-fuchsia-500 text-sm font-bold text-white shadow-md shadow-violet-500/30'>
        ✦
      </div>

      <div className='flex min-w-0 flex-col gap-0.5'>
        <span className='bg-linear-to-r from-violet-700 to-fuchsia-600 bg-clip-text text-sm font-semibold tracking-tight text-transparent dark:from-violet-300 dark:to-fuchsia-300'>
          {headline}
        </span>
        <span className='truncate text-xs text-zinc-600'>{subtitle}</span>
      </div>
    </div>
  );
}
