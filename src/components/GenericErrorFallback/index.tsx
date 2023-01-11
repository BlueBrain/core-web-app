'use client';

import { WarningOutlined } from '@ant-design/icons';

export function SimpleErrorComponent({ error }: { error: Error }) {
  return (
    <div className="h-full w-full flex flex-col gap-5 items-center p-4 justify-center">
      <div className="text-2xl flex gap-2">
        <WarningOutlined />
        <span>An error occurred</span>
      </div>

      {error?.message && (
        <div className="flex flex-col border-2 p-8">
          <div className="text-sm">DESCRIPTION</div>
          <div className="text-xl">{error.message}</div>
        </div>
      )}
    </div>
  );
}

export default SimpleErrorComponent;
