import { ComponentType, useRef } from 'react';
import { ConfigProvider, Modal } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { classNames } from '@/util/utils';

type UseSimulationModal<T extends {}> = (props: T) => [() => () => void, JSX.Element];

export default function useSimulationModal<T extends {}>({
  showCloseIcon = true,
  Content,
}: {
  showCloseIcon?: boolean;
  Content: ComponentType<T>;
}): UseSimulationModal<T & { id: string }> {
  const [modal, contextHolder] = Modal.useModal();
  const destroyRef = useRef<() => void>();

  return (props: T & { id: string }) => {
    return [
      () => {
        const { destroy } = modal.confirm({
          title: null,
          icon: null,
          closable: showCloseIcon,
          maskClosable: true,
          footer: null,
          width: 680,
          centered: true,
          mask: true,
          styles: { mask: { background: '#002766ba' }, body: { padding: '20px' } },
          closeIcon: showCloseIcon && <CloseOutlined className="text-2xl text-primary-8" />,
          className: classNames(
            '[&_.ant-modal-confirm-body]:!w-full [&_.ant-modal-confirm-paragraph]:max-w-full'
          ),
          content: (
            <Content
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...props}
              onClose={() => Modal.destroyAll()}
            />
          ),
        });
        destroyRef.current = destroy;
        return destroy;
      },
      <ConfigProvider key={props.id} theme={{ hashed: false }}>
        {contextHolder}
      </ConfigProvider>,
    ];
  };
}
