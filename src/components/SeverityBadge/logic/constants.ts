export const Severity = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Critical: 'critical',
} as const;

type SeverityKeys = keyof typeof Severity;
export type SeverityValues = (typeof Severity)[SeverityKeys];
