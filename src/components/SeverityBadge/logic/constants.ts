export const Severity = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Critical: 'critical',
} as const;

type SeverityType = typeof Severity;
type SeverityKeys = keyof SeverityType;
export type SeverityValues = SeverityType[SeverityKeys];
