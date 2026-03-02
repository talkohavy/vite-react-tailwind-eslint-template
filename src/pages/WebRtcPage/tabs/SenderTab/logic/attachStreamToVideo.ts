/**
 * Single responsibility: display a media stream in a video element (local preview).
 * Does not acquire the stream or send it over WebRTC.
 */
export function attachStreamToVideo(stream: MediaStream, videoElement: HTMLVideoElement | null): void {
  if (!videoElement) return;

  videoElement.srcObject = stream;
  videoElement.play().catch(() => {
    console.error('Failed to play video');
  });
}
