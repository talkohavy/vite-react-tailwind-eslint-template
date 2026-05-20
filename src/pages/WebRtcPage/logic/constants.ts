export const pageSlug = 'webrtc';

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

export const WebRtcSignalTypes = {
  Sender: 'sender',
  Receiver: 'receiver',
  CreateOffer: 'createOffer',
  CreateAnswer: 'createAnswer',
  IceCandidate: 'iceCandidate',
} as const;

export type WebRtcSignalTypesValues = (typeof WebRtcSignalTypes)[keyof typeof WebRtcSignalTypes];
