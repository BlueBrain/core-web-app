import { useRef } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { ConfigProvider, Modal } from 'antd';

import InsertImageDialog from './InlineImage/Dialog';
import { UploaderGenerator } from './utils';
import { classNames } from '@/util/utils';

type UseImageUploader = ({
  id,
  multiple,
}: {
  id: string;
  multiple: boolean;
}) => [() => () => void, JSX.Element];

type UploaderProps = {
  onUpload: UploaderGenerator;
};

type ContentProps = {
  multiple: boolean;
  onUpload: UploaderGenerator;
  onClose: () => void;
};

function Content({ multiple, onUpload, onClose }: ContentProps) {
  return (
    <div>
      {!multiple && (
        <InsertImageDialog
          key="paper-insert-image-dialog"
          {...{
            onClose,
            onUpload,
          }}
        />
      )}
    </div>
  );
}

export default function useImageUploader({ onUpload }: UploaderProps): UseImageUploader {
  const destroyRef = useRef<() => void>();
  const [modal, contextHolder] = Modal.useModal();
  const onClose = () => destroyRef?.current?.();

  return ({ id, multiple }: { id: string; multiple: boolean }) => {
    return [
      () => {
        const { destroy } = modal.success({
          title: null,
          icon: null,
          closable: true,
          maskClosable: true,
          footer: null,
          width: 680,
          centered: true,
          mask: false,
          className: classNames(
            '[&_.ant-modal-confirm-body]:!w-full [&_.ant-modal-confirm-paragraph]:max-w-full'
          ),
          styles: {
            body: { padding: '60px 40px 20px' },
          },
          closeIcon: <CloseOutlined className="text-2xl " />,
          content: (
            <Content
              {...{
                multiple,
                onClose,
                onUpload,
              }}
            />
          ),
        });

        destroyRef.current = destroy;

        return destroy;
      },
      <ConfigProvider
        key={id}
        theme={{
          hashed: false,
          token: {
            colorBgBase: 'white',
            colorTextBase: 'black',
          },
        }}
      >
        {contextHolder}
      </ConfigProvider>,
    ];
  };
}
