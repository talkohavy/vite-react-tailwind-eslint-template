export type EventLogEntry = {
  id: number;
  type: 'sent' | 'received';
  event: string;
  payload: unknown;
  time: Date;
};
