'use client';

import { ConfigProvider, Select } from 'antd';
import { useRouter } from 'next/navigation';

import { DownOutlined } from '@ant-design/icons';
import {
  EXPERIMENT_TYPE_DETAILS,
  ExperimentDetail,
} from '@/constants/explore-section/experiment-types';

type Props = {
  currentExperiment?: ExperimentDetail;
};

export default function ExperimentSelector({ currentExperiment }: Props) {
  const router = useRouter();
  return (
    <div className="flex flex-col">
      <span className="text-gray-400 text-sm">Keywords</span>
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
          bordered={false}
          defaultValue={currentExperiment?.name}
          value={currentExperiment?.name}
          onChange={(experimentName) => {
            router.push(`/explore/interactive/literature/${experimentName}`);
          }}
          options={EXPERIMENT_TYPE_DETAILS.map((experimentDetail) => ({
            label: <span className="font-semibold text-base">{experimentDetail.title}</span>,
            value: experimentDetail.name,
          }))}
          popupMatchSelectWidth={false}
          className="border-b-2 text-primary-8 min-w-max w-36 p-0!"
          suffixIcon={<DownOutlined className="text-primary-8 text-[8px]" />}
        />
      </ConfigProvider>
    </div>
  );
}
