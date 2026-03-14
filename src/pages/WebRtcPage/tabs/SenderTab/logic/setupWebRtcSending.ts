import { SocketEvents, type SocketEventMessage } from '@src/common/constants/websocket';
import { WebRtcSignalTypes } from '../../../logic/constants';
import type { WebRtcSignalingPayload } from '../../../logic/types';

type SetupWebRtcSendingProps = {
  socket: WebSocket;
  sessionId: string;
  mediaStream: MediaStream;
};

/**
 * Single responsibility: set up an RTCPeerConnection to send a media stream
 * over the given WebSocket (signaling) and add all tracks from the stream.
 * Does not handle acquiring the stream or displaying it locally.
 */
export function setupWebRtcSending(props: SetupWebRtcSendingProps): RTCPeerConnection {
  const { socket, sessionId, mediaStream } = props;

  const peerConnection = new RTCPeerConnection();

  peerConnection.onnegotiationneeded = async () => {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    const webRtcMessage: SocketEventMessage<WebRtcSignalingPayload> = {
      event: SocketEvents.WebRtc,
      payload: {
        type: WebRtcSignalTypes.CreateOffer,
        sdp: peerConnection.localDescription!,
        sessionId,
      },
    };

    socket.send(JSON.stringify(webRtcMessage));
  };

  peerConnection.onicecandidate = (event) => {
    if (!event.candidate) return;

    const webRtcMessage: SocketEventMessage<WebRtcSignalingPayload> = {
      event: SocketEvents.WebRtc,
      payload: {
        type: WebRtcSignalTypes.IceCandidate,
        candidate: event.candidate,
        sessionId,
      },
    };

    socket.send(JSON.stringify(webRtcMessage));
  };

  const iceCandidateQueue: RTCIceCandidateInit[] = [];
  let remoteDescriptionSet = false;

  socket.onmessage = async (event: MessageEvent<string>) => {
    const payload = JSON.parse(event.data);

    if (payload.type === WebRtcSignalTypes.CreateAnswer && payload.sdp) {
      await peerConnection.setRemoteDescription(payload.sdp);
      remoteDescriptionSet = true;
      for (const candidate of iceCandidateQueue) {
        await peerConnection.addIceCandidate(candidate);
      }
      iceCandidateQueue.length = 0;
    } else if (payload.type === WebRtcSignalTypes.IceCandidate && payload.candidate) {
      if (remoteDescriptionSet) {
        await peerConnection.addIceCandidate(payload.candidate);
      } else {
        iceCandidateQueue.push(payload.candidate);
      }
    }
  };

  const videoTrack = mediaStream.getVideoTracks()[0];
  const audioTrack = mediaStream.getAudioTracks()[0];

  if (videoTrack) peerConnection.addTrack(videoTrack, mediaStream);
  if (audioTrack) peerConnection.addTrack(audioTrack, mediaStream);

  return peerConnection;
}
