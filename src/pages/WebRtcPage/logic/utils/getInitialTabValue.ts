import { Tabs } from '../constants';

export function getInitialTabValue(): string {
  const path = window.location.pathname;

  if (path.endsWith('/sender')) return Tabs.Sender;

  if (path.endsWith('/receiver')) return Tabs.Receiver;

  return Tabs.Overview;
}
