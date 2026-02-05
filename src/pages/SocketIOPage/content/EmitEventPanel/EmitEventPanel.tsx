import Button from '@src/components/controls/Button';
import Input from '@src/components/controls/Input';
import Textarea from '@src/components/controls/Textarea';

type EmitEventPanelProps = {
  eventName: string;
  setEventName: (eventName: string) => void;
  isConnected: boolean;
  handleEmit: () => void;
  payloadText: string;
  setPayloadText: (payloadText: string) => void;
};

export default function EmitEventPanel(props: EmitEventPanelProps) {
  const { eventName, setEventName, isConnected, handleEmit, payloadText, setPayloadText } = props;

  const isEmitDisabled = !isConnected || !eventName.trim();

  return (
    <section className='flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900'>
      <h2 className='text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>Emit event</h2>

      <div className='grid gap-3 sm:grid-cols-[1fr_auto]'>
        <div>
          <label
            htmlFor='socket-event-name'
            className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'
          >
            Event name
          </label>

          <Input
            initialValue={eventName}
            onChange={setEventName}
            placeholder='e.g. register-to-topic'
            disabled={!isConnected}
            className='block w-full dark:bg-gray-800 dark:border-gray-600'
          />
        </div>

        <div className='flex items-end'>
          <Button onClick={handleEmit} disabled={isEmitDisabled} className='w-full sm:w-auto'>
            Emit
          </Button>
        </div>
      </div>

      <div>
        <label htmlFor='socket-payload' className='mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300'>
          Payload (optional JSON)
        </label>

        <Textarea
          value={payloadText}
          setValue={(e) => setPayloadText(e.target.value)}
          placeholder='{"topic": "topics:events-stream"}'
          rows={3}
          resize='vertical'
          disabled={!isConnected}
          className='block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800'
        />
      </div>
    </section>
  );
}
