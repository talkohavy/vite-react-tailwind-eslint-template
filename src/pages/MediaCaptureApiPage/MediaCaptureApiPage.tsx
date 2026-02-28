import CapturedPicture from './content/CapturedPicture';
import HowItWorksTutorial from './content/HowItWorksTutorial';
import StreamCamera from './content/StreamCamera';
import { useMediaCaptureApiPageLogic } from './logic/useMediaCaptureApiPageLogic';

/**
 * Tutorial: Taking still photos with getUserMedia() in React
 *
 * This page mirrors the MDN demo (https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos)
 * using React patterns: refs for DOM elements, state for stream/photo/error, and cleanup on unmount.
 */
export default function MediaCaptureApiPage() {
  const {
    videoRef,
    canvasRef,
    error,
    photoDataUrl,
    videoWidth,
    startCameraDisabled,
    takePictureDisabled,
    onVideoCanPlay,
    startCamera,
    takePicture,
    stopCamera,
    openFullscreen,
  } = useMediaCaptureApiPageLogic();

  return (
    <div className='flex flex-col size-full overflow-auto p-6 gap-1'>
      {/* Tutorial header */}
      <header className='space-y-2'>
        <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
          Taking still photos with <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>getUserMedia()</code>
        </h1>

        <p className='text-sm text-gray-600 dark:text-gray-400'>
          This demo uses{' '}
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>navigator.mediaDevices.getUserMedia()</code> to
          access your camera, show a live preview in a{' '}
          <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>&lt;video&gt;</code>, and capture a still frame
          into a <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>&lt;canvas&gt;</code> as a PNG. Based on
          the{' '}
          <a
            href='https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos'
            target='_blank'
            rel='noreferrer'
            className='text-blue-600 underline dark:text-blue-400'
          >
            MDN tutorial
          </a>
          .
        </p>
      </header>

      <HowItWorksTutorial />

      {/* Demo: camera + capture */}
      <section className='flex flex-col flex-wrap gap-8'>
        <div className='min-w-70 flex-1 space-y-3'>
          <h3 className='text-sm font-semibold text-gray-700 dark:text-gray-300'>1. Stream &amp; capture</h3>

          <StreamCamera
            videoRef={videoRef}
            startCameraDisabled={startCameraDisabled}
            takePictureDisabled={takePictureDisabled}
            videoWidth={videoWidth}
            startCamera={startCamera}
            takePicture={takePicture}
            stopCamera={stopCamera}
            onVideoCanPlay={onVideoCanPlay}
            openFullscreen={openFullscreen}
          />

          {error && (
            <p className='text-sm text-red-600 dark:text-red-400' role='alert'>
              {error}
            </p>
          )}
        </div>

        <CapturedPicture photoDataUrl={photoDataUrl} />
      </section>

      {/* Hidden canvas used only for drawing the frame (user doesn't see it) */}
      <canvas ref={canvasRef} className='hidden' aria-hidden />
    </div>
  );
}
