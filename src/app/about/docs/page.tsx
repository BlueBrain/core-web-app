'use client';

import { ConfigProvider, Input } from 'antd';

import MostRead from '@/components/About/Documentation/MostRead';
import Tutorial from '@/components/About/Documentation/Tutorial';
import { classNames } from '@/util/utils';

export default function Docs() {
  return (
    <div className="bg-white py-10">
      <div className="inline-flex w-full items-center justify-between gap-2 px-12">
        <h1 className="w-full max-w-max text-4xl font-bold text-primary-8">BBOP Documentation</h1>
        <ConfigProvider theme={{ hashed: false }}>
          <Input.Search
            placeholder="Search topic ..."
            className={classNames(
              'max-w-sm border-b border-primary-8',
              '[&>.ant-input-wrapper>.ant-input]:border-0 [&>.ant-input-wrapper>.ant-input]:shadow-none [&>.ant-input-wrapper>.ant-input]:outline-none',
              '[&>.ant-input-wrapper>.ant-input-group-addon>button]:rounded-none  [&>.ant-input-wrapper>.ant-input-group-addon>button]:border-0'
            )}
          />
        </ConfigProvider>
      </div>
      <div className="w-full bg-white px-12">
        <MostRead />
        <Tutorial />
      </div>
    </div>
  );
}
