import { useCallback, useEffect, useRef, useState } from 'react';

export function useMediaCaptureApiPageLogic() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  const startCameraDisabled = Boolean(stream);
  const takePictureDisabled = !(stream && isStreaming);

  useEffect(() => {
    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => void track.stop());
      }
    };
  }, [stream]);

  const startCamera = useCallback(async () => {
    setError(null);

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1920, height: 1080 }, // <--- video: true or... 3840 x 2160, 1920 x 1080, 1280 x 720,
        audio: false,
      });

      setStream(mediaStream);

      const video = videoRef.current;

      if (!video) return;

      video.srcObject = mediaStream;
      await video.play();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(`Camera error: ${message}`);
    }
  }, []);

  const onVideoCanPlay = useCallback(() => {
    const video = videoRef.current;

    const canPlayVideo = video && !isStreaming;

    if (!canPlayVideo) return;

    setIsStreaming(true);
  }, [isStreaming]);

  const stopCamera = useCallback(() => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => void track.stop());

      setStream(null);
    }

    setIsStreaming(false);
    setPhotoDataUrl(null);

    const video = videoRef.current;

    if (video) video.srcObject = null;
  }, [stream]);

  const takePicture = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    const canTakePicture = video && canvas && video.videoWidth > 0;

    if (!canTakePicture) return setPhotoDataUrl(null);

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const canvasWidth = video.videoWidth;
    const canvasHeight = video.videoHeight;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);
    const dataUrl = canvas.toDataURL('image/png');
    setPhotoDataUrl(dataUrl);
  }, []);

  return {
    videoRef,
    canvasRef,
    error,
    photoDataUrl,
    startCameraDisabled,
    takePictureDisabled,
    get videoWidth() {
      return videoRef.current?.videoWidth ?? 0;
    },
    onVideoCanPlay,
    startCamera,
    takePicture,
    stopCamera,
  };
}
