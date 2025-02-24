import Modal from '../../../Modal';
import ErrorMessageTitle from '../ErrorMessageTitle';
import ErrorStackTrace from '../ErrorStackTrace';
import LineSeparator from '../LineSeparator';
import TopRedRibbon from '../TopRedRibbon';

type ModalFallbackProps = {
  error: Error | null;
};

export default function ModalFallback(props: ModalFallbackProps) {
  const { error } = props;

  return (
    <Modal id='error-modal' className='bg-[#030303] bg-opacity-100 p-6'>
      <div
        className='relative top-1/2 flex h-auto w-full max-w-5xl -translate-y-1/2 animate-appear flex-col items-start justify-between gap-6 rounded-xl bg-[#181818] p-10 text-center'
        style={{ direction: 'ltr' }}
      >
        <TopRedRibbon />

        <ErrorMessageTitle errorMessage={error?.message} />

        <LineSeparator />

        <ErrorStackTrace stackTrace={error?.stack} />
      </div>
    </Modal>
  );
}
