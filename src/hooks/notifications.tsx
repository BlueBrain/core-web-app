import { Placement } from '@/types/notifications';
import openNotification from '@/api/notifications';

export default function useNotification() {
  /**
   * Adds an error message in the notifications queue
   * @param message
   * @param duration
   * @param placement
   */
  function error(message: string, duration: number = 5, placement: Placement = 'bottomRight') {
    openNotification('error', message, duration, placement);
  }

  /**
   * Adds a warning message in the notifications queue
   * @param message
   * @param duration
   * @param placement
   */
  function warning(message: string, duration: number = 5, placement: Placement = 'bottomRight') {
    openNotification('warning', message, duration, placement);
  }

  /**
   * Adds a success message in the notifications queue
   * @param message
   * @param duration
   * @param placement
   */
  function success(message: string, duration: number = 5, placement: Placement = 'bottomRight') {
    openNotification('success', message, duration, placement);
  }

  /**
   * Adds an info message in the notifications queue
   * @param message
   * @param duration
   * @param placement
   */
  function info(message: string, duration: number = 5, placement: Placement = 'bottomRight') {
    openNotification('info', message, duration, placement);
  }

  return { error, warning, success, info };
}
