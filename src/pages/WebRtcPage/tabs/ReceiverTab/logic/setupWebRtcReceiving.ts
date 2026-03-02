import { SocketEvents, type SocketEventMessage } from '@src/common/constants/websocket';
import { WebRtcSignalTypes } from '../../../logic/constants';
import type { WebRtcSignalingPayload } from '../../../logic/types';

export type SetupWebRtcReceivingCallbacks = {
  onRemoteStream: (stream: MediaStream) => void;
  onStreamCleared: () => void;
};

type SetupWebRtcReceivingProps = {
  socket: WebSocket;
  sessionId: string;
  offerSdp: RTCSessionDescriptionInit;
  callbacks: SetupWebRtcReceivingCallbacks;
};

export type ReceiverSession = {
  peerConnection: RTCPeerConnection;
  handleIceCandidate: (candidate: RTCIceCandidateInit) => Promise<void>;
};

/**
 * Single responsibility: create an RTCPeerConnection for the receiver side,
 * set remote description from the offer, create and send the answer, and
 * set up track/connection/ice handlers. Caller handles signaling message routing.
 */
export function setupWebRtcReceiving(props: SetupWebRtcReceivingProps): ReceiverSession {
  const { socket, sessionId, offerSdp, callbacks } = props;

  const { onRemoteStream, onStreamCleared } = callbacks;

  const peerConnection = new RTCPeerConnection();
  const remoteStream = new MediaStream();
  const iceCandidateQueue: RTCIceCandidateInit[] = [];

  peerConnection.onconnectionstatechange = () => {
    const state = peerConnection.connectionState;
    if (state === 'disconnected' || state === 'failed' || state === 'closed') {
      onStreamCleared();
    }
  };

  peerConnection.onicecandidate = (iceEvent) => {
    if (!iceEvent.candidate) return;

    const message: SocketEventMessage<WebRtcSignalingPayload> = {
      event: SocketEvents.WebRtc,
      payload: {
        type: WebRtcSignalTypes.IceCandidate,
        candidate: iceEvent.candidate,
        sessionId,
      },
    };

    socket.send(JSON.stringify(message));
  };

  peerConnection.ontrack = (trackEvent) => {
    remoteStream.addTrack(trackEvent.track);
    // Notify once when the first track arrives so the UI can show and attach the stream.
    // Later tracks (e.g. audio) are added to the same MediaStream; no need to notify again.
    if (remoteStream.getTracks().length === 1) {
      onRemoteStream(remoteStream);
    }
  };

  async function handleOffer() {
    await peerConnection.setRemoteDescription(offerSdp);

    for (const candidate of iceCandidateQueue) {
      await peerConnection.addIceCandidate(candidate);
    }

    iceCandidateQueue.length = 0;

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    const message: SocketEventMessage<WebRtcSignalingPayload> = {
      event: SocketEvents.WebRtc,
      payload: {
        type: WebRtcSignalTypes.CreateAnswer,
        sdp: peerConnection.localDescription!,
        sessionId,
      },
    };

    socket.send(JSON.stringify(message));
  }

  async function handleIceCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    if (peerConnection.remoteDescription) {
      await peerConnection.addIceCandidate(candidate);
    } else {
      iceCandidateQueue.push(candidate);
    }
  }

  void handleOffer().catch(() => {
    onStreamCleared();
  });

  return {
    peerConnection,
    handleIceCandidate,
  };
}
