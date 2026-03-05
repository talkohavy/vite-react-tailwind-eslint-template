export interface VisualizationItem {
  id: string;
  label: string;
  start: number;
  end: number;
  type: 'token' | 'ast';
  subType: string;
  level: number;
  color: string;
}
