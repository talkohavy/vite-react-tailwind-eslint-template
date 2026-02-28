import { useCallback, useEffect, useRef, useState } from 'react';

export function useScreenCaptureApiPageLogic() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [displaySurface, setDisplaySurface] = useState<string | null>(null);

  const startCaptureDisabled = !!stream;

  useEffect(() => {
    return () => {
      if (!streamRef.current) return;

      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => void track.stop());
      streamRef.current = null;
    };
  }, []);

  const stopScreenCapture = useCallback(() => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => void track.stop());
      streamRef.current = null;
    }

    setStream(null);
    setIsStreaming(false);
    setDisplaySurface(null);

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const startScreenCapture = useCallback(async () => {
    setError(null);
    setDisplaySurface(null);

    try {
      const mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });

      streamRef.current = mediaStream;
      setStream(mediaStream);

      const video = videoRef.current;

      if (!video) return;

      video.srcObject = mediaStream;

      await video.play();

      const [videoTrack] = mediaStream.getVideoTracks() as [MediaStreamTrack];

      const settings = videoTrack.getSettings();

      setDisplaySurface(settings.displaySurface!);

      // Screen sharing can end manually, but it can also end automatically when the user clicks "Stop sharing" or closes the browser tab.
      videoTrack.addEventListener('ended', stopScreenCapture);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(`Screen capture error: ${message}`);
    }
  }, [stopScreenCapture]);

  const onVideoCanPlay = useCallback(() => {
    if (videoRef.current && !isStreaming) {
      setIsStreaming(true);
    }
  }, [isStreaming]);

  return {
    videoRef,
    error,
    displaySurface,
    startCaptureDisabled,
    isStreaming,
    onVideoCanPlay,
    startScreenCapture,
    stopScreenCapture,
  };
}
