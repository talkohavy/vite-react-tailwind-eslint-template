import { SocketEvents } from '@src/common/constants';
import { WebRtcSignalTypes } from '../../../../logic/constants';
import type { WebRtcSignalingPayload } from '../../../../logic/types';
import type { ClientMessage } from '@src/common/types';

type SetupWebRtcPeerConnectionProps = {
  send: (message: string) => void;
  sessionId: string;
  mediaStream: MediaStream;
};

type SetupWebRtcPeerConnectionResult = {
  peerConnection: RTCPeerConnection;
  handleCreateAnswer: (sdp: RTCSessionDescriptionInit) => Promise<void>;
  handleIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>;
};

/**
 * Single responsibility: set up an RTCPeerConnection to send a media stream
 * over the given signaling channel and add all tracks from the stream.
 * Does not handle acquiring the stream, displaying it locally, or inbound signaling
 * (answers / ICE) — callers wire those via the returned handlers.
 */
export function setupWebRtcPeerConnection(props: SetupWebRtcPeerConnectionProps): SetupWebRtcPeerConnectionResult {
  const { send, sessionId, mediaStream } = props;

  const peerConnection = new RTCPeerConnection();
  const iceCandidateQueue: RTCIceCandidateInit[] = [];
  let remoteDescriptionSet = false;

  peerConnection.onnegotiationneeded = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    const webRtcMessage: ClientMessage<WebRtcSignalingPayload> = {
      event: SocketEvents.WebRtc,
      payload: {
        type: WebRtcSignalTypes.CreateOffer,
        sdp: peerConnection.localDescription!,
        sessionId,
      },
    };

    send(JSON.stringify(webRtcMessage));
  };

  peerConnection.onicecandidate = (event) => {
    if (!event.candidate) return;

    const webRtcMessage: ClientMessage<WebRtcSignalingPayload> = {
      event: SocketEvents.WebRtc,
      payload: {
        type: WebRtcSignalTypes.IceCandidate,
        candidate: event.candidate,
        sessionId,
      },
    };

    send(JSON.stringify(webRtcMessage));
  };

  async function handleCreateAnswer(sdp: RTCSessionDescriptionInit): Promise<void> {
    await peerConnection.setRemoteDescription(sdp);
    remoteDescriptionSet = true;

    for (const candidate of iceCandidateQueue) {
      await peerConnection.addIceCandidate(candidate);
    }

    iceCandidateQueue.length = 0;
  }

  async function handleIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (remoteDescriptionSet) {
      await peerConnection.addIceCandidate(candidate);
    } else {
      iceCandidateQueue.push(candidate);
    }
  }

  const videoTrack = mediaStream.getVideoTracks()[0];
  const audioTrack = mediaStream.getAudioTracks()[0];

  if (videoTrack) peerConnection.addTrack(videoTrack, mediaStream);
  if (audioTrack) peerConnection.addTrack(audioTrack, mediaStream);

  return {
    peerConnection,
    handleCreateAnswer,
    handleIceCandidate,
  };
}
