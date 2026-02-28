import HowItWorksTutorial from './content/HowItWorksTutorial';
import ScreenShareStreamDisplay from './content/ScreenShareStreamDisplay';
import { useScreenCaptureApiPageLogic } from './logic/useScreenCaptureApiPageLogic';

/**
 * Demo: Screen Capture API with getDisplayMedia()
 *
 * Lets the user select a screen, window, or tab to capture as a MediaStream
 * and displays it in a video element. Based on the
 * [Screen Capture API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API).
 */
export default function ScreenCaptureApiPage() {
  const {
    videoRef,
    error,
    displaySurface,
    startCaptureDisabled,
    isStreaming,
    onVideoCanPlay,
    startScreenCapture,
    stopScreenCapture,
  } = useScreenCaptureApiPageLogic();

  return (
    <div className='flex flex-col size-full overflow-auto p-6 gap-4'>
      <header className='flex flex-col gap-2'>
        <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
          Screen Capture with <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>getDisplayMedia()</code>
        </h1>

        <p className='text-sm text-gray-600 dark:text-gray-400'>
          This demo uses{' '}
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>navigator.mediaDevices.getDisplayMedia()</code> to
          let you choose a screen, window, or browser tab to capture. The stream is shown in a{' '}
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>&lt;video&gt;</code>. Based on the{' '}
          <a
            href='https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API'
            target='_blank'
            rel='noreferrer'
            className='text-blue-600 underline dark:text-blue-400'
          >
            Screen Capture API (MDN)
          </a>
          .
        </p>
      </header>

      <HowItWorksTutorial />

      <section className='flex flex-col flex-wrap gap-8'>
        <div className='min-w-70 flex-1 space-y-3'>
          <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>Live capture</h3>

          <ScreenShareStreamDisplay
            videoRef={videoRef}
            startCaptureDisabled={startCaptureDisabled}
            displaySurface={displaySurface}
            isStreaming={isStreaming}
            onVideoCanPlay={onVideoCanPlay}
            startCapture={startScreenCapture}
            stopCapture={stopScreenCapture}
          />

          {error && (
            <p className='text-sm text-red-600 dark:text-red-400' role='alert'>
              {error}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
