import { SocketEvents } from '@src/common/constants';
import { WebRtcSignalTypes } from '../../../../logic/constants';
import type { WebRtcSignalingPayload } from '../../../../logic/types';
import type { ClientMessage } from '@src/common/types';

type HandleCreateOfferIncomingMessageProps = {
  send: (message: string) => void;
  sessionId: string;
  offerSdp: RTCSessionDescriptionInit;
  callbacks: SetupWebRtcReceivingCallbacks;
};

export function handleCreateOfferIncomingMessage(props: HandleCreateOfferIncomingMessageProps) {
  const { send, sessionId, offerSdp, callbacks } = props;

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

    const message: ClientMessage<WebRtcSignalingPayload> = {
      event: SocketEvents.WebRtc,
      payload: {
        type: WebRtcSignalTypes.IceCandidate,
        candidate: iceEvent.candidate,
        sessionId,
      },
    };

    send(JSON.stringify(message));
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

    const message: ClientMessage<WebRtcSignalingPayload> = {
      event: SocketEvents.WebRtc,
      payload: {
        type: WebRtcSignalTypes.CreateAnswer,
        sdp: peerConnection.localDescription!,
        sessionId,
      },
    };

    send(JSON.stringify(message));
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

type SetupWebRtcReceivingCallbacks = {
  onRemoteStream: (stream: MediaStream) => void;
  onStreamCleared: () => void;
};
