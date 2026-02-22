import Button from '@src/components/controls/Button';
import Textarea from '@src/components/controls/Textarea';
import CodeBlock from '../../../../components/CodeBlock';

type SendMessagePanelProps = {
  messageToSend: string;
  setMessageToSend: (value: string) => void;
  isConnected: boolean;
  send: () => void;
};

export default function SendMessagePanel(props: SendMessagePanelProps) {
  const { messageToSend, setMessageToSend, isConnected, send } = props;

  const isSendDisabled = !(isConnected && messageToSend.trim());

  return (
    <section className='flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900'>
      <h2 className='text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>Send message</h2>

      <div className='flex flex-col gap-3'>
        <Textarea
          value={messageToSend}
          setValue={(e) => setMessageToSend(e.target.value)}
          placeholder='Type a message in JSON format'
          rows={3}
          resize='vertical'
          disabled={!isConnected}
          className='block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-800'
        />

        <div className='flex flex-col gap-1'>
          <div className='text-sm font-medium text-gray-700 dark:text-gray-500'>Example:</div>

          <CodeBlock
            language='json'
            code={`{
  "event": "actions",
  "payload": {
    "action": "register",
    "topic": "data"
  }
}`}
          />
        </div>

        <Button onClick={send} disabled={isSendDisabled} className='w-full sm:w-auto'>
          Send
        </Button>
      </div>
    </section>
  );
}
