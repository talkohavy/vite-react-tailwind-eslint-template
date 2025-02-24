import ErrorMessageTitle from '../ErrorBoundaryWithModalFallback/ErrorMessageTitle/ErrorMessageTitle';
import LineSeparator from '../ErrorBoundaryWithModalFallback/LineSeparator/LineSeparator';
import TopRedRibbon from '../ErrorBoundaryWithModalFallback/TopRedRibbon/TopRedRibbon';

type FallbackPageProps = {
  error: Error | null;
};
export default function FallbackPage(props: FallbackPageProps) {
  const { error } = props;

  return (
    <div className='size-full border p-6' style={{ direction: 'ltr' }}>
      <div className='relative mx-auto flex max-w-xl flex-col items-center justify-center gap-6 rounded-xl border border-black p-6'>
        <h1 className='text-3xl font-bold text-red-500'>Something went wrong</h1>

        <TopRedRibbon />

        <ErrorMessageTitle errorMessage={error?.message} />

        <LineSeparator />

        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi exercitationem dolor repellat. Consequatur
          perspiciatis adipisci, blanditiis modi distinctio dolorum ducimus sequi inventore ab sit molestias deserunt
          dolor omnis earum nostrum fugiat iste tenetur facilis tempora. Illum, consequuntur?
        </p>
      </div>
    </div>
  );
}
