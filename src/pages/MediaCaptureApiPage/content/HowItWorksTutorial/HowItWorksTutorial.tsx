export default function HowItWorksTutorial() {
  return (
    <section className='rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50'>
      <h2 className='mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400'>
        How it works
      </h2>

      <ol className='list-inside list-decimal space-y-2 text-sm text-gray-700 dark:text-gray-300'>
        <li>
          <strong>Get the stream:</strong> <code>getUserMedia(&#123; video: true, audio: false &#125;)</code> returns a{' '}
          <code>MediaStream</code>. Assign it to <code>video.srcObject</code> and call <code>video.play()</code>.
        </li>

        <li>
          <strong>Capture a frame:</strong> Use <code>ctx.drawImage(video, 0, 0, width, height)</code> to copy the
          current frame into the canvas, then <code>canvas.toDataURL(&#39;image/png&#39;)</code> to get a data URL for
          the <code>&lt;img&gt;</code>.
        </li>
      </ol>
    </section>
  );
}
