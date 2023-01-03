import { useEffect, useState } from 'react';
import { Modal, Input, Button } from 'antd';
import { useSession } from 'next-auth/react';

import { BrainModelConfigResource } from '@/types/nexus';
import { renameBrainModelConfig } from '@/api/nexus';

type RenameBrainConfigModalProps = {
  open: boolean;
  config: BrainModelConfigResource;
  onCancel: () => void;
  onRenameSuccess: (id: string, newName: string) => void;
};

export default function RenameBrainConfigModal({
  open,
  onCancel,
  onRenameSuccess,
  config,
}: RenameBrainConfigModalProps) {
  const { data: session } = useSession();

  const [newName, setNewName] = useState<string>(config.name);
  const [isRenaming, setIsRenaming] = useState<boolean>(false);

  const rename = async () => {
    if (!newName || !session) return;

    setIsRenaming(true);
    await renameBrainModelConfig(config, newName, session);
    setIsRenaming(false);

    onRenameSuccess(config['@id'], newName);
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
          disabled={!newName && newName === config.name}
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
