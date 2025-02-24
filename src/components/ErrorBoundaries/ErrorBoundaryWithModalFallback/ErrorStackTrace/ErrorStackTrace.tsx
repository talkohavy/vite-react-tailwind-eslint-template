type ErrorStackTraceProps = {
  stackTrace: any;
};

export default function ErrorStackTrace(props: ErrorStackTraceProps) {
  const { stackTrace } = props;

  return (
    <pre className='w-full overflow-auto text-start font-thin text-neutral-200' style={{ lineHeight: 2 }}>
      {stackTrace}
    </pre>
  );
}
