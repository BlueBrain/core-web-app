'use client';

import { ConfigProvider, Select } from 'antd';
import { useRouter } from 'next/navigation';

import { DownOutlined } from '@ant-design/icons';
import { EXPERIMENT_DATA_TYPES } from '@/constants/explore-section/data-types/experiment-data-types';
import { DataTypeConfig } from '@/types/explore-section/data-types';

type Props = {
  currentExperiment?: DataTypeConfig;
};

export default function ExperimentSelector({ currentExperiment }: Props) {
  const router = useRouter();
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-400">Keywords</span>
      <ConfigProvider
        theme={{
          token: {
            colorText: '#003A8C',
            fontSize: 20,
            fontWeightStrong: 600,
            colorIcon: '#003A8C',
            paddingSM: 0,
          },
        }}
      >
        <Select
          aria-label="keywords"
          placeholder="Experiment type"
          variant="borderless"
          defaultValue={currentExperiment?.name}
          value={currentExperiment?.name}
          onChange={(experimentName) => {
            router.push(`/explore/interactive/literature/${experimentName}`);
          }}
          options={Object.values(EXPERIMENT_DATA_TYPES).map((config) => ({
            label: <span className="text-base font-semibold">{config.title}</span>,
            value: config.name,
          }))}
          popupMatchSelectWidth={false}
          className="p-0! w-36 min-w-max border-b-2 text-primary-8"
          suffixIcon={<DownOutlined className="text-[8px] text-primary-8" />}
        />
      </ConfigProvider>
    </div>
  );
}
