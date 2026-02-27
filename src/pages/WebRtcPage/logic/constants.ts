/**
 * Event name sent to the signaling server for all WebRTC signaling messages.
 */
export const WEB_RTC_EVENT = 'web-rtc' as const;

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
