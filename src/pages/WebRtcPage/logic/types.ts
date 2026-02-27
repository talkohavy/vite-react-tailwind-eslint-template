/**
 * Payload sent to the signaling server.
 * Server expects { event: 'webrtc', payload: WebrtcSignalingPayload }.
 */
export type WebRtcSignalingPayload =
  | { type: 'sender' }
  | { type: 'receiver' }
  | { type: 'createOffer'; sdp: RTCSessionDescriptionInit }
  | { type: 'createAnswer'; sdp: RTCSessionDescriptionInit }
  | { type: 'iceCandidate'; candidate: RTCIceCandidateInit };

/**
 * Messages received from the signaling server (relayed from the other peer).
 */
export type WebRtcSignalingMessage =
  | { type: 'createOffer'; sdp: RTCSessionDescriptionInit }
  | { type: 'createAnswer'; sdp: RTCSessionDescriptionInit }
  | { type: 'iceCandidate'; candidate: RTCIceCandidateInit };
