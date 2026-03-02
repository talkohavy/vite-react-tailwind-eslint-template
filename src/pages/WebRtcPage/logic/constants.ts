export const Tabs = {
  Overview: '',
  Sender: 'sender',
  Receiver: 'receiver',
} as const;

export const tabOptions = [
  { value: Tabs.Overview, label: 'Overview' },
  { value: Tabs.Sender, label: 'Sender' },
  { value: Tabs.Receiver, label: 'Receiver' },
];

export const ConnectionState = {
  Idle: 'idle',
  Connecting: 'connecting',
  Open: 'open',
  Closed: 'closed',
} as const;

export type ConnectionStateValues = (typeof ConnectionState)[keyof typeof ConnectionState];

export const WebRtcSignalTypes = {
  Sender: 'sender',
  Receiver: 'receiver',
  CreateOffer: 'createOffer',
  CreateAnswer: 'createAnswer',
  IceCandidate: 'iceCandidate',
};

export const WEBRTC_SESSION_ID = 'aaa-bbb-ccc';

export type WebRtcSignalTypesValues = (typeof WebRtcSignalTypes)[keyof typeof WebRtcSignalTypes];
