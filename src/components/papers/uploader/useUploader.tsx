import { useRef } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { ConfigProvider, Modal } from 'antd';

import { UploaderGenerator, UseImageUploaderInput } from './types';
import { classNames } from '@/util/utils';
import InsertGalleryDialog from '@/components/papers/PaperEditor/plugins/GalleryPlugin/Dialog';
import InsertImageDialog from '@/components/papers/PaperEditor/plugins/ImagePlugin/InlineImage/Dialog';
import InsertVideoDialog from '@/components/papers/PaperEditor/plugins/VideoPlugin/Dialog';

type UseImageUploader = ({
  id,
  multiple,
  type,
}: UseImageUploaderInput) => [() => () => void, JSX.Element];

type UploaderProps = {
  onUpload: UploaderGenerator;
};

type ContentProps = {
  type: 'image' | 'video';
  multiple: boolean;
  onUpload: UploaderGenerator;
  onClose: () => void;
};

function Content({ type, multiple, onUpload, onClose }: ContentProps) {
  switch (type) {
    case 'image': {
      return multiple ? (
        <InsertGalleryDialog
          key="paper-insert-gallery-dialog"
          {...{
            onClose,
            onUpload,
          }}
        />
      ) : (
        <InsertImageDialog
          key="paper-insert-image-dialog"
          {...{
            onClose,
            onUpload,
          }}
        />
      );
    }
    case 'video': {
      return (
        <InsertVideoDialog
          key="paper-insert-video-dialog"
          {...{
            onClose,
            onUpload,
          }}
        />
      );
    }
    default:
      return null;
  }
}

export default function useUploader({ onUpload }: UploaderProps): UseImageUploader {
  const destroyRef = useRef<() => void>();
  const [modal, contextHolder] = Modal.useModal();
  const onClose = () => destroyRef?.current?.();

  return ({ id, multiple, type }: UseImageUploaderInput) => {
    return [
      () => {
        const { destroy } = modal.success({
          title: null,
          icon: null,
          closable: true,
          maskClosable: false,
          footer: null,
          width: 680,
          centered: true,
          mask: false,
          className: classNames(
            '[&_.ant-modal-confirm-body]:!w-full [&_.ant-modal-confirm-paragraph]:max-w-full'
          ),
          styles: {
            body: { padding: '20px' },
          },
          closeIcon: <CloseOutlined className="text-2xl" />,
          content: (
            <Content
              {...{
                type,
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
