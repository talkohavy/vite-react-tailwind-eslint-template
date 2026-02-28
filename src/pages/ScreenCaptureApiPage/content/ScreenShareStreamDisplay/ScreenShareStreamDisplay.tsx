import type { RefObject } from 'react';
import Button from '@src/components/controls/Button';

type ScreenShareStreamDisplayProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  startCaptureDisabled: boolean;
  displaySurface: string | null;
  isStreaming: boolean;
  onVideoCanPlay: () => void;
  startCapture: () => void;
  stopCapture: () => void;
};

export default function ScreenShareStreamDisplay(props: ScreenShareStreamDisplayProps) {
  const { videoRef, startCaptureDisabled, displaySurface, isStreaming, onVideoCanPlay, startCapture, stopCapture } =
    props;

  return (
    <div>
      <div className='inline-block max-w-full overflow-hidden rounded-lg border border-gray-200 bg-black dark:border-gray-700'>
        <video
          ref={videoRef}
          onCanPlay={onVideoCanPlay}
          playsInline
          muted
          controls={isStreaming}
          // autoPlay
          className='h-auto w-full object-contain'
        >
          Screen stream not available.
          <track kind='captions' />
        </video>
      </div>

      {displaySurface && (
        <p className='mt-2 text-sm text-gray-500 dark:text-gray-400'>
          Capturing: <code className='rounded bg-gray-200 px-1 dark:bg-gray-700'>{displaySurface}</code>
        </p>
      )}

      <div className='mt-3 flex flex-wrap gap-2'>
        <Button
          onClick={startCapture}
          disabled={startCaptureDisabled}
          className='bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50'
        >
          Start screen capture
        </Button>
        <Button
          onClick={stopCapture}
          disabled={!startCaptureDisabled}
          className='bg-gray-600 hover:bg-gray-700 disabled:opacity-50'
        >
          Stop capture
        </Button>
      </div>
    </div>
  );
}
