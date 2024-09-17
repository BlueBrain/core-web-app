import { ReactNode } from 'react';

export type Status =
  | 'initalized'
  | 'processing'
  | 'done'
  | 'running'
  | 'error'
  | 'created'
  | 'default';

export type ActivityRecord = {
  id: string;
  key: string;
  scale: string;
  activity: 'Build' | 'Simulate' | 'Build - Analysis';
  usecase: 'Single cell' | 'Synaptome';
  name: string;
  status: Status;
  date: string;
  linkUrl: string;
};

export type ActivityColumn = {
  title: string;
  dataIndex?: string;
  key?: keyof ActivityRecord;
  render?: (text: string, record: ActivityRecord) => ReactNode;
};
