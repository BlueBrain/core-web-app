import { useAtomValue } from 'jotai/react';
import notificationsAtom from '@/state/notifications';
import Notification from '@/components/Notification';

export default function NotificationProvider() {
  const notificationAtom = useAtomValue(notificationsAtom);

  return (
    <>
      {notificationAtom.map((notification) => (
        <Notification
          key={notification.id}
          id={notification.id}
          type={notification.type}
          message={<span>{notification.message}</span>}
          duration={notification.duration}
        />
      ))}
    </>
  );
}
