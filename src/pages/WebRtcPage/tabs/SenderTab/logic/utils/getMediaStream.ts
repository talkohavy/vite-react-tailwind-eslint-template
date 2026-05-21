/**
 * Share source: screen (getDisplayMedia) or camera (getUserMedia).
 * Single responsibility: acquire a media stream from the chosen source.
 */
export type ShareSource = 'screen' | 'camera';

export async function getMediaStream(source: ShareSource): Promise<MediaStream> {
  if (source === 'screen') {
    return navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
  }

  return navigator.mediaDevices.getUserMedia({ video: true, audio: true });
}
