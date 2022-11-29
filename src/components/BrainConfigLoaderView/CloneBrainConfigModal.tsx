import { useState } from 'react';
import { Modal, Input } from 'antd';

type CloneBrainConfigModalProps = {
  open: boolean;
  brainConfigId: string;
  onCancel: () => void;
  onCloneSuccess: (brainConfigId: string) => void;
};

export default function CloneBrainConfigModal({
  brainConfigId,
  open,
  onCancel,
  onCloneSuccess,
}: CloneBrainConfigModalProps) {
  const [configName, setConfigName] = useState<string>();
  const [isCloning, setIsCloning] = useState<boolean>(false);

  const clone = () => {
    setIsCloning(true);
    setTimeout(() => {
      setIsCloning(false);
      onCloneSuccess(`${brainConfigId}-new`);
    }, 3000);
  };

  return (
    <Modal
      title="Edit configuration"
      open={open}
      okText="Start editing"
      onOk={clone}
      onCancel={onCancel}
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
      />
    </Modal>
  );
}
