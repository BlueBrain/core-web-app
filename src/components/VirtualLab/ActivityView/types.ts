import { ReactNode } from 'react';

export type Status = 'initalized' | 'processing' | 'running' | 'error' | 'done' | 'default';

export type ActivityRecord = {
  key: string;
  scale: string;
  type: string;
  section: string;
  name: string;
  status: Status;
  date: string;
};

export type ActivityColumn = {
  title: string;
  dataIndex?: string;
  key?: keyof ActivityRecord;
  render?: (text: string, record: ActivityRecord) => ReactNode;
};
