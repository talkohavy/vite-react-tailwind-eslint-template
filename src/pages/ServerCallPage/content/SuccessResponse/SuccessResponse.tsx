type SuccessResponseProps = {
  data: any;
};

export default function SuccessResponse(props: SuccessResponseProps) {
  const { data } = props;

  return (
    <div className='bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl shadow-lg p-6 border border-green-200 dark:border-green-800'>
      <h2 className='text-lg font-semibold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2'>
        ✅ Success Response
      </h2>

      <pre className='bg-white dark:bg-slate-900 rounded-lg p-4 overflow-auto text-sm border border-green-200 dark:border-green-800'>
        <code className='text-gray-800 dark:text-gray-200'>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
}
