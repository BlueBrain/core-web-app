'use client';

import { ConfigProvider, Input } from 'antd';

import MostRead from '@/components/About/Documentation/MostRead';
import Tutorial from '@/components/About/Documentation/Tutorial';
import { classNames } from '@/util/utils';

export default function Docs() {
  return (
    <div className="py-10 bg-white">
      <div className="inline-flex items-center justify-between gap-2 w-full px-12">
        <h1 className="text-4xl text-primary-8 font-bold max-w-max w-full">OBP Documentation</h1>
        <ConfigProvider theme={{ hashed: false }}>
          <Input.Search
            placeholder="Search topic ..."
            className={classNames(
              'max-w-sm border-b border-primary-8',
              '[&>.ant-input-wrapper>.ant-input]:border-0 [&>.ant-input-wrapper>.ant-input]:shadow-none [&>.ant-input-wrapper>.ant-input]:outline-none',
              '[&>.ant-input-wrapper>.ant-input-group-addon>button]:border-0  [&>.ant-input-wrapper>.ant-input-group-addon>button]:rounded-none'
            )}
          />
        </ConfigProvider>
      </div>
      <div className="bg-white w-full px-12">
        <MostRead />
        <Tutorial />
      </div>
    </div>
  );
}
