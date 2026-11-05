export type Stage = 'none' | 'generated' | 'shared';
export type Status = 'attention' | 'ready' | 'generated' | 'shared';
export type FilterTab = 'everyone' | Status;

export interface Form16Record {
  id: string;
  fy: string;
  name: string;
  department: string;
  pan: string;
  gross: number;
  tax: number;
  stage: Stage;
}

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}
