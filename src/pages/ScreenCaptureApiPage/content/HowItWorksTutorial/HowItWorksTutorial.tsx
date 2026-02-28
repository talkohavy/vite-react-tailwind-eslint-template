import LineOfCode from '@src/components/LineOfCode';

export default function HowItWorksTutorial() {
  return (
    <section className='rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50'>
      <h2 className='mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
        How it works
      </h2>

      <ol className='list-inside list-decimal space-y-2 text-sm text-gray-700 dark:text-gray-300'>
        <li>
          <strong>Request capture:</strong>{' '}
          <LineOfCode text='navigator.mediaDevices.getDisplayMedia(&#123; video: true, audio: false &#125;)' /> prompts
          the user to select a screen, window, or browser tab. It returns a <code>MediaStream</code>.
        </li>

        <li>
          <strong>Show the stream:</strong> Assign the stream to <code>video.srcObject</code> and call{' '}
          <code>video.play()</code>. The browser may end the track when the user clicks &quot;Stop sharing&quot;; listen
          to the track&apos;s <code>ended</code> event to clean up.
        </li>
      </ol>
    </section>
  );
}
