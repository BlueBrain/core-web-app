'use client';

import { useSetAtom } from 'jotai';
import notificationsAtom from '@/state/notifications';

export default function useNotification() {
  const setNotifications = useSetAtom(notificationsAtom);

  /**
   * Adds a notification of a given type and duration in the notifications queue
   *
   * @param type
   * @param message
   * @param duration
   */
  const setNotification = (
    type: 'info' | 'success' | 'error' | 'warning',
    message: string,
    duration: number = 5
  ) => {
    setNotifications((notifications) => {
      // starts from -1 in order to have zero-based counting for IDs
      let maxId = -1;
      if (notifications.length > 0) {
        maxId = Math.max(...notifications.map((not) => not.id));
      }
      return [...notifications, { id: maxId + 1, type, message, duration }];
    });
  };

  /**
   * Adds an error message in the notifications queue
   * @param message
   * @param duration
   */
  function error(message: string, duration: number = 5) {
    setNotification('error', message, duration);
  }

  /**
   * Adds a warning message in the notifications queue
   * @param message
   * @param duration
   */
  function warning(message: string, duration: number = 5) {
    setNotification('warning', message, duration);
  }

  /**
   * Adds a success message in the notifications queue
   * @param message
   * @param duration
   */
  function success(message: string, duration: number = 5) {
    setNotification('success', message, duration);
  }

  /**
   * Adds an info message in the notifications queue
   * @param message
   * @param duration
   */
  function info(message: string, duration: number = 5) {
    setNotification('info', message, duration);
  }

  return { error, warning, success, info };
}
