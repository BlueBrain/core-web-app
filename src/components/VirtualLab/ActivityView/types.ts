export type RowItem = {
  key: string;
  scale: string;
  type: string;
  section: string;
  name: string;
  status: string;
  date: string;
};

export type ActivityColumn = {
  title: string;
  dataIndex?: string;
  key?: keyof RowItem;
  render?: (data: any) => React.ReactNode;
};
