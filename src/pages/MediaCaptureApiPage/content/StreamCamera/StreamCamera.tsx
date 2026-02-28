import type { RefObject } from 'react';
import clsx from 'clsx';
import Button from '@src/components/controls/Button';
import styles from './StreamCamera.module.scss';

type StreamCameraProps = {
  videoRef: RefObject<HTMLVideoElement | null>;
  startCameraDisabled: boolean;
  takePictureDisabled: boolean;
  videoWidth: number;
  onVideoCanPlay: () => void;
  startCamera: () => void;
  takePicture: () => void;
  stopCamera: () => void;
  openFullscreen: () => void;
};

export default function StreamCamera(props: StreamCameraProps) {
  const {
    videoRef,
    startCameraDisabled,
    takePictureDisabled,
    videoWidth,
    onVideoCanPlay,
    startCamera,
    takePicture,
    stopCamera,
    openFullscreen,
  } = props;

  return (
    <div>
      <div className='inline-block overflow-hidden rounded-lg border border-gray-200 bg-black dark:border-gray-700'>
        <video
          ref={videoRef}
          onCanPlay={onVideoCanPlay}
          playsInline
          muted
          className={clsx(styles.video, 'h-auto')}
          style={{ width: videoWidth || '100%' }}
        >
          Video stream not available.
        </video>
      </div>

      <div className='flex flex-wrap gap-2'>
        <Button
          onClick={startCamera}
          disabled={startCameraDisabled}
          className='bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50'
        >
          Allow camera
        </Button>

        <Button
          onClick={takePicture}
          disabled={takePictureDisabled}
          className='bg-blue-600 hover:bg-blue-700 disabled:opacity-50'
        >
          Capture photo
        </Button>

        <Button
          onClick={stopCamera}
          disabled={!startCameraDisabled}
          className='bg-gray-600 hover:bg-gray-700 disabled:opacity-50'
        >
          Stop camera
        </Button>

        <Button onClick={openFullscreen} className='bg-gray-600 hover:bg-gray-700 disabled:opacity-50'>
          Full screen
        </Button>
      </div>
    </div>
  );
}
