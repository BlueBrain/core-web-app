'use client';

import { ReactNode } from 'react';
import { Collapse, CollapseProps, ConfigProvider } from 'antd';

type Props = {
  title?: ReactNode;
  total?: number;
  totalSpent: number;
  remaining: number;
  suspended?: boolean;
};

export default function BudgetPanel({
  title = <h4 className="font-semibold">Budget</h4>,
  total,
  totalSpent,
  remaining,
  suspended,
}: Props) {
  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: (
        <div className="flex items-center justify-between text-white">
          {title}
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
    <div
      className="mt-[3px] flex flex-col gap-5 bg-primary-8 p-3"
      style={{ minHeight: suspended ? 119.5 : undefined, boxSizing: 'content-box' }}
    >
      <ConfigProvider
        theme={{
          components: {
            Collapse: {
              colorTextHeading: '#F2F2F2',
            },
          },
        }}
      >
        {!!title && total !== undefined && (
          <Collapse
            bordered={false}
            expandIconPosition="end"
            items={items}
            defaultActiveKey={['1']}
          />
        )}
      </ConfigProvider>
    </div>
  );
}
