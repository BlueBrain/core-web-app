'use client';

import { WarningOutlined } from '@ant-design/icons';

function SimpleErrorComponent({ error }: { error: Error }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-4 text-gray-500">
      <div className="flex gap-2 text-2xl">
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
