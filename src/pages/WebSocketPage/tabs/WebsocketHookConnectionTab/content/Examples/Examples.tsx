import CodeBlock from '@src/components/CodeBlock';

export default function Examples() {
  return (
    <div>
      <div className='flex flex-col gap-1'>
        <div className='text-sm font-medium text-gray-700 dark:text-gray-500'>Example 1: Register to a topic</div>

        <CodeBlock
          language='json'
          code={`{
  "event": "register",
  "payload": {
    "topic": "data"
  }
}`}
        />
      </div>

      <div className='text-sm font-medium text-gray-700 dark:text-gray-500'>
        Example 2: send message to a topic ("presence" or "topics:events-stream")
      </div>

      <CodeBlock
        language='json'
        code={`{
  "event": "send",
  "payload": {
    "topic": "presence",
    "data": {
      "message": "Hello, world!"
    }
  }
}`}
      />
    </div>
  );
}
