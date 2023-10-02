import { CheckCircleFilled, InfoCircleOutlined, WarningFilled } from '@ant-design/icons';
import { notification } from 'antd';
import { NotificationType, Placement } from '@/types/notifications';

/**
 * Function used in order to open a notification using the antD notification API
 * Important to use this one since it modifies the styles to be more uniform
 *
 * @param type the notification type
 * @param message the message to display
 * @param duration the duration in seconds
 * @param placement where to appear in the screen
 */
export default function openNotification(
  type: NotificationType,
  message: string,
  duration: number = 5,
  placement: Placement = 'bottomRight'
) {
  let icon;
  let backgroundColor;

  switch (type) {
    case 'error':
      icon = <WarningFilled style={{ color: 'white' }} />;
      backgroundColor = '#F5222D';
      break;
    case 'warning':
      icon = <WarningFilled style={{ color: 'white' }} />;
      backgroundColor = '#FA8C16';
      break;
    case 'info':
      icon = <InfoCircleOutlined style={{ color: 'white' }} />;
      backgroundColor = '#003A8C';
      break;
    default:
      icon = <CheckCircleFilled style={{ color: 'white' }} />;
      backgroundColor = '#237804';
  }

  notification[type]({
    message: <div className="text-neutral-1">{message}</div>,
    style: { backgroundColor },
    closeIcon: false,
    duration,
    icon,
    placement,
  });
}
