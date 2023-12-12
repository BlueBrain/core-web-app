'use client';

import { CloseOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Input, InputRef, Modal, Spin } from 'antd';
import { useRef, useState } from 'react';

export default function DangerZonePanel({
  onDeleteVirtualLabClick,
  labName,
}: {
  labName: string;
  onDeleteVirtualLabClick: () => Promise<void>;
}) {
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [error, setError] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);

  const onDeletionConfirm = () => {
    setShowConfirmationDialog(false);
    setSavingChanges(true);

    onDeleteVirtualLabClick()
      .then(() => {
        setError(false);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setSavingChanges(false);
      });
  };

  return savingChanges ? (
    <Spin />
  ) : (
    <div>
      <DeleteVirtualLabConfirmation
        open={showConfirmationDialog}
        onCancel={() => setShowConfirmationDialog(false)}
        onConfirm={onDeletionConfirm}
        labName={labName}
      />
      {error && <p className="text-error">There was an error when deleting this lab.</p>}

      <Button
        danger
        type="primary"
        onClick={() => {
          setShowConfirmationDialog(true);
        }}
        className="rounded-none"
      >
        Delete Virtual Lab
      </Button>
    </div>
  );
}

function DeleteVirtualLabConfirmation({
  open,
  onCancel,
  onConfirm,
  labName,
}: {
  open: boolean;
  labName: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const inputRef = useRef<InputRef>(null);
  const [incorrectValueText, setIncorrectValue] = useState<string | null>(null);

  const confirmThenDelete = () => {
    const expectedValue = `Delete ${labName}`;
    const actualValue = inputRef.current?.input?.value;

    if (expectedValue === actualValue) {
      setIncorrectValue(null);
      onConfirm();
    } else {
      showValidationError(actualValue);
    }
  };

  const showValidationError = (actualValue?: string) => {
    if (!actualValue) {
      setIncorrectValue('Please input Delete <your virtual lab name>');
    } else if (!actualValue?.startsWith('Delete')) {
      setIncorrectValue('The word "Delete" is missing in your input');
    } else {
      setIncorrectValue('The name of the virtual lab is incorrect');
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Modal: {
            colorText: '#000',
            paddingContentHorizontal: 36,
          },
          Input: {
            colorBorder: 'transparent',
            colorText: '#595959',
          },
        },
        token: {
          borderRadius: 0,
        },
      }}
    >
      <Modal
        open={open}
        className="text-center"
        destroyOnClose
        okButtonProps={{ className: 'hidden' }}
        cancelButtonProps={{ className: 'hidden' }}
        style={{ maxWidth: '348px' }}
        styles={{ body: { maxWidth: '348px' } }}
        closeIcon={<CloseOutlined onClick={onCancel} />}
      >
        <h3 className="font-bold text-xl">Are you sure you want to delete the virtual lab?</h3>
        <p>
          Type{' '}
          <span className="bg-gray-100 px-2 text-gray-500">
            Delete &lt;your virtual lab name&gt;
          </span>
        </p>

        <div className="border-b border-b-500 mt-5">
          <Input
            ref={inputRef}
            placeholder="Write your confirmation here..."
            aria-label="confirm lab delete"
            bordered={false}
            className="font-bold placeholder:font-normal"
          />
        </div>
        {incorrectValueText && <span className="text-error">{incorrectValueText}</span>}

        <div className="mt-5">
          <Button type="text" onClick={onCancel} className="text-gray-700">
            cancel
          </Button>

          <Button onClick={confirmThenDelete} className="text-white bg-[#595959]">
            Confirm
          </Button>
        </div>
      </Modal>
    </ConfigProvider>
  );
}
