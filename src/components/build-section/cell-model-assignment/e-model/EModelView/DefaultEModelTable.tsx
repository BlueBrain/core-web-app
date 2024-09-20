import { ConfigProvider, Table, ThemeConfig } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { ExemplarMorphologyDataType, ExperimentalTracesDataType } from '@/types/e-model';

const theme: ThemeConfig = {
  components: {
    Table: {
      colorText: '#0050B3',
      colorTextHeading: '#8C8C8C',
      headerBg: 'white',
      fontWeightStrong: 400,
    },
  },
};

type SupportedDataTypes = ExemplarMorphologyDataType | ExperimentalTracesDataType;

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
        dataSource={dataSource}
        pagination={{ hideOnSinglePage: true }}
        rowKey="@id"
        columns={columns}
        rowClassName="[&:last-child>td]:!border-b-0"
        scroll={{
          x: true,
        }}
      />
    </ConfigProvider>
  );
}
