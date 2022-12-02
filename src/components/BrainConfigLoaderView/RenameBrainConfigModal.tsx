import { useEffect, useState } from 'react';
import { Modal, Input, Button } from 'antd';

type RenameBrainConfigModalProps = {
  open: boolean;
  brainConfig: {
    id: string;
    name: string;
  };
  onCancel: () => void;
  onRenameSuccess: (id: string, newName: string) => void;
};

export default function RenameBrainConfigModal({
  open,
  onCancel,
  onRenameSuccess,
  brainConfig,
}: RenameBrainConfigModalProps) {
  const [newName, setNewName] = useState<string>(brainConfig.name);
  const [isRenaming, setIsRenaming] = useState<boolean>(false);

  const rename = () => {
    if (!newName) return;

    setIsRenaming(true);
    setTimeout(() => {
      setIsRenaming(false);
      onRenameSuccess(brainConfig.id, newName);
    }, 2000);
  };

  useEffect(() => {}, []);

  return (
    <Modal
      title="Rename configuration"
      open={open}
      onCancel={onCancel}
      confirmLoading={isRenaming}
      destroyOnClose
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="rename"
          type="primary"
          loading={isRenaming}
          onClick={rename}
          disabled={!newName && newName === brainConfig.name}
        >
          Rename configuration
        </Button>,
      ]}
    >
      <Input
        className="mt-2"
        value={newName}
        autoFocus
        onChange={(e) => {
          setNewName(e.target.value);
        }}
        onPressEnter={rename}
      />
    </Modal>
  );
}
