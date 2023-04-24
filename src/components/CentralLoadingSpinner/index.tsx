import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';

export default function CentralLoadingSpinner() {
  return (
    <Spin
      style={{ display: 'table', width: '100%', height: '100vh' }}
      indicator={
        <LoadingOutlined
          style={{
            fontSize: 54,
            display: 'table-cell',
            verticalAlign: 'middle',
          }}
        />
      }
    />
  );
}
