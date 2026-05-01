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
    <Modal isOpen positionerClassName='bg-black' backdropClassName='bg-red-500' showCloseButton={false}>
      <div
        className='relative flex flex-col items-start justify-between gap-6 w-2xl p-10 bg-[#181818] text-center'
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
