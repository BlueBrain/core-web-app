import * as Toast from '@radix-ui/react-toast';
import {
  CheckCircleFilled,
  EyeOutlined,
  InfoCircleOutlined,
  WarningFilled,
} from '@ant-design/icons';
import { ReactElement } from 'react';
import { useSetAtom } from 'jotai/react';
import notificationsAtom from '@/state/notifications';
import Styles from './notification.module.css';

type NotificationProps = {
  id: number;
  type: 'info' | 'success' | 'error' | 'warning';
  message: ReactElement;
  duration?: number;
};

export default function Notification({ id, type, message, duration = 5 }: NotificationProps) {
  const setNotificationsAtom = useSetAtom(notificationsAtom);

  let icon;
  let backgroundColor;
  switch (type) {
    case 'error':
      icon = <WarningFilled />;
      backgroundColor = 'bg-error';
      break;
    case 'warning':
      icon = <EyeOutlined />;
      backgroundColor = 'bg-warning';
      break;
    case 'info':
      icon = <InfoCircleOutlined />;
      backgroundColor = 'bg-primary-7';
      break;
    default:
      icon = <CheckCircleFilled />;
      backgroundColor = 'bg-green-700';
  }

  /**
   * Removes the notification that from the atom after it was displayed
   */
  const removeNotificationFromAtom = () => {
    setNotificationsAtom((notifications) =>
      notifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <>
      <Toast.Root
        className={`${Styles.ToastRoot} py-[13px] px-[26px] rounded-[4px] w-[360px] text-center text-neutral-1 ${backgroundColor}`}
        duration={duration * 1000}
        onOpenChange={removeNotificationFromAtom}
      >
        <Toast.Title>
          {icon} {message}
        </Toast.Title>
      </Toast.Root>
      <Toast.Viewport className={Styles.ToastViewport} />
    </>
  );
}
