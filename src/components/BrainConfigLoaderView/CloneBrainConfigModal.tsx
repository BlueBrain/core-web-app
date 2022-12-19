import { useState } from 'react';
import { Modal, Input } from 'antd';
import { useSession } from 'next-auth/react';

import { BrainModelConfig } from '@/types/nexus';
import { cloneBrainModelConfig } from '@/api/nexus';

type CloneBrainConfigModalProps = {
  open: boolean;
  config: BrainModelConfig;
  onCancel: () => void;
  onCloneSuccess: (brainConfigId: string) => void;
};

export default function CloneBrainConfigModal({
  config,
  open,
  onCancel,
  onCloneSuccess,
}: CloneBrainConfigModalProps) {
  const { data: session } = useSession();

  const [configName, setConfigName] = useState<string>(config.name);
  const [isCloning, setIsCloning] = useState<boolean>(false);

  const clone = async () => {
    if (!session) return;

    setIsCloning(true);

    const newConfigMetadata = await cloneBrainModelConfig(config['@id'], configName, session);
    setIsCloning(false);
    onCloneSuccess(`${newConfigMetadata['@id']}`);
  };

  return (
    <Modal
      title="Edit configuration"
      open={open}
      okText="Start editing"
      onOk={clone}
      onCancel={onCancel}
      destroyOnClose
      confirmLoading={isCloning}
    >
      <p>
        Duplicate the original configuration. Give it a new name and start working on your own
        configuration.
      </p>

      <Input
        className="mt-2"
        value={configName}
        onChange={(e) => {
          setConfigName(e.target.value);
        }}
        onPressEnter={clone}
      />
    </Modal>
  );
}
