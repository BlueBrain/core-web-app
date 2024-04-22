// import redirect from 'next/router';
import { CloseOutlined } from '@ant-design/icons';
import { Button, ConfigProvider, Input, InputRef, Modal, Spin } from 'antd';
import { useRef, useState } from 'react';
import { VirtualLab } from '@/types/virtual-lab/lab';

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
        <h3 className="text-xl font-bold">Are you sure you want to delete the virtual lab?</h3>
        <p>
          Type&nbsp;
          <span className="bg-gray-100 px-2 text-gray-500">
            Delete &lt;your virtual lab name&gt;
          </span>
        </p>

        <div className="border-b-500 mt-5 border-b">
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
            Cancel
          </Button>

          <Button onClick={confirmThenDelete} className="bg-[#595959] text-white">
            Confirm
          </Button>
        </div>
      </Modal>
    </ConfigProvider>
  );
}

export default function DangerZonePanel({
  onClick,
  name,
}: {
  name: string;
  onClick: () => Promise<VirtualLab>;
}) {
  const [infoText, setInfoText] = useState<string | null>(null);
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [error, setError] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);

  const onDeletionConfirm = () => {
    setShowConfirmationDialog(false);
    setSavingChanges(true);

    onClick()
      .then((deletedLab: VirtualLab) => {
        setError(false);

        const { name: virtualLabName } = deletedLab;

        setInfoText(`You have now deleted ${virtualLabName}.`);
      })
      .catch((response: { message: string }) => {
        setError(true);

        const { message } = response;

        setInfoText(`There was an error when deleting this lab. ${message}.`);
      })
      .finally(() => {
        setSavingChanges(false);

        // setTimeout(() => redirect(path)); // TODO: Use this to redirect back to /virtual-lab
      });
  };

  return savingChanges ? (
    <Spin />
  ) : (
    <div className="flex items-center justify-between">
      <DeleteVirtualLabConfirmation
        open={showConfirmationDialog}
        onCancel={() => setShowConfirmationDialog(false)}
        onConfirm={onDeletionConfirm}
        labName={name}
      />

      {infoText && <p className={error ? 'text-error' : 'text-white'}>{infoText}</p>}

      <Button
        className="ml-auto h-14 rounded-none bg-neutral-3 font-semibold text-neutral-7"
        danger
        onClick={() => {
          setShowConfirmationDialog(true);
        }}
        type="primary"
      >
        Delete Virtual Lab
      </Button>
    </div>
  );
}
