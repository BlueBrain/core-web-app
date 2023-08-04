import { ConfigProvider, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { ExamplarMorphologyDataType, ExperimentalTracesDataType } from '@/types/e-model';

const theme = {
  components: {
    Table: {
      colorText: '#0050B3',
      colorTextHeading: '#BFBFBF',
    },
  },
};

type SupportedDataTypes = ExamplarMorphologyDataType | ExperimentalTracesDataType;

type Props<T> = {
  dataSource: T[];
  columns: ColumnsType<T>;
};

export default function DefaultEModelTable<T extends SupportedDataTypes>({
  dataSource,
  columns,
}: Props<T>) {
  return (
    <ConfigProvider theme={theme}>
      <Table<T>
        size="small"
        className="mt-6 mb-12"
        dataSource={dataSource}
        pagination={false}
        rowKey="@id"
        columns={columns}
      />
    </ConfigProvider>
  );
}
