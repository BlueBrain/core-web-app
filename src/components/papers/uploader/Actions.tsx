import { Button } from 'antd';

type ActionsProps = {
  uploading: boolean;
  onClose: () => void;
  onTriggerUpload: () => void;
};

export function Actions({ uploading, onClose, onTriggerUpload }: ActionsProps) {
  return (
    <div className="mt-8 flex items-center justify-end gap-2">
      <Button
        size="large"
        type="text"
        htmlType="button"
        className="rounded-none bg-transparent px-6 text-lg"
        disabled={uploading}
        onClick={onClose}
      >
        Cancel
      </Button>
      <Button
        size="large"
        type="primary"
        htmlType="button"
        className="rounded-none bg-primary-8 px-6 text-lg"
        onClick={onTriggerUpload}
        disabled={uploading}
        loading={uploading}
      >
        Confirm
      </Button>
    </div>
  );
}
