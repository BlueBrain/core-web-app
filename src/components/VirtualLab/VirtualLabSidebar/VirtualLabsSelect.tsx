import { ConfigProvider, Select, Spin } from 'antd';
import { LoadingOutlined, SwapOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';
import { virtualLabOfUserAtom } from '@/state/virtual-lab/lab';

export default function VirtualLabsSelect() {
  const virtualLabs = useAtomValue(loadable(virtualLabOfUserAtom));
  if (virtualLabs.state === 'loading') {
    return <Spin indicator={<LoadingOutlined />} />;
  }
  if (virtualLabs.state === 'hasError') {
    return null;
  }

  const virtualLabOptions: { value: string; label: string }[] = virtualLabs.data.results.map(
    (vl) => ({ value: vl.id, label: vl.name })
  );

  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            colorBgContainer: '#002766',
            colorBgElevated: '#002766',
            colorBorder: '#0050B3',
            colorText: 'rgb(255, 255, 255)',
            optionSelectedBg: '#002766',
            borderRadius: 0,
            controlHeight: 40,
          },
        },
      }}
    >
      <Select
        suffixIcon={<SwapOutlined style={{ color: '#40A9FF' }} />}
        defaultValue="1"
        onChange={() => {}}
        options={virtualLabOptions}
      />
    </ConfigProvider>
  );
}
