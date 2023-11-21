import { useAtomValue } from 'jotai';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { ApplicationSection } from '@/types/common';
import { loadingAtom } from '@/components/ThreeDeeBrain/state';

type LoadingHandlerProps = {
  section: ApplicationSection;
};

export function LoadingHandler({ section }: LoadingHandlerProps) {
  const loading = useAtomValue(loadingAtom);
  return (
    loading[section].length > 0 && (
      <Spin
        size="large"
        indicator={<LoadingOutlined />}
        className="text-neutral-3 absolute top-1/2 left-1/2"
      />
    )
  );
}
