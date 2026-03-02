import type { WebRtcSignalTypes } from './constants';

/**
 * Payload sent to the signaling server.
 * Server expects { event: 'webrtc', payload: WebrtcSignalingPayload }.
 */
export type WebRtcSignalingPayload = { sessionId: string } & (
  | { type: typeof WebRtcSignalTypes.Sender }
  | { type: typeof WebRtcSignalTypes.Receiver }
  | { type: typeof WebRtcSignalTypes.CreateOffer; sdp: RTCSessionDescriptionInit }
  | { type: typeof WebRtcSignalTypes.CreateAnswer; sdp: RTCSessionDescriptionInit }
  | { type: typeof WebRtcSignalTypes.IceCandidate; candidate: RTCIceCandidateInit }
);
