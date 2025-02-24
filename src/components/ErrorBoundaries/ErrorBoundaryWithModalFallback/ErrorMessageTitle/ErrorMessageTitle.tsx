type ErrorMessageTitleProps = {
  errorMessage?: string;
};

export default function ErrorMessageTitle(props: ErrorMessageTitleProps) {
  const { errorMessage } = props;

  return <pre className='no-scrollbar w-full overflow-x-auto text-xl font-bold text-[#ff5655]'>{errorMessage}</pre>;
}
