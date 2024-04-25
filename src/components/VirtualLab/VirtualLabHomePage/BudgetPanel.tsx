'use client';

import { Collapse, CollapseProps, ConfigProvider } from 'antd';

type Props = {
  total: number;
  totalSpent: number;
  remaining: number;
};

export default function BudgetPanel({ total, totalSpent, remaining }: Props) {
  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <div className="flex justify-between text-white">
          <h4 className="font-semibold">Budget</h4>
          <div className="text-primary-2">
            Total budget: <span>$ {total}</span>
          </div>
        </div>
      ),
      children: (
        <div className="flex flex-col gap-3 text-white">
          {/* budget loader */}
          <div className="h-3 overflow-hidden rounded-full bg-primary-3">
            <div className="h-full w-[60%] bg-white" />
          </div>
          {/* Total spent + remaining */}
          <div className="flex justify-between">
            <div className="flex flex-row gap-3">
              <div>Total spent</div>
              <span className="font-bold">$ {totalSpent}</span>
            </div>
            <div className="text-primary-3">
              Remaining: <span>$ {remaining}</span>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-[3px] flex flex-col gap-5 bg-primary-8 p-3">
      <ConfigProvider
        theme={{
          components: {
            Collapse: {
              colorTextHeading: '#F2F2F2',
            },
          },
        }}
      >
        <Collapse
          bordered={false}
          expandIconPosition="end"
          items={items}
          defaultActiveKey={['1']}
        />
      </ConfigProvider>
    </div>
  );
}
