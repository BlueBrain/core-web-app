import { WarningOutlined } from '@ant-design/icons';

export default function EditorFallbackErrorComponent({ error }: { error: Error }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-5 p-4">
      <div className="flex gap-2 text-2xl">
        <WarningOutlined />
        <span>An error occurred</span>
      </div>

      {error?.message && (
        <div className="flex flex-col border-2 p-8">
          <div className="text-sm">DESCRIPTION</div>
          <div className="text-xl">
            The paper Editor couldn&apos;t be loaded due to an unexpected issue
          </div>
        </div>
      )}
    </div>
  );
}
