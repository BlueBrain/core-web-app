import { Button } from 'antd';

export default function ActionPlugin() {
  return (
    <div className="fixed bottom-3 right-[3.3rem] z-50 flex items-center justify-end gap-3 py-4">
      <Button
        htmlType="button"
        type="primary"
        className="h-12 rounded-none bg-primary-8 px-12 text-lg"
      >
        Preview
      </Button>
      <Button
        htmlType="button"
        type="primary"
        className="h-12 rounded-none bg-primary-8 px-12 text-lg"
      >
        Export
      </Button>
    </div>
  );
}
