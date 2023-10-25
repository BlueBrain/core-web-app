import { useCallback } from 'react';
import { Placement } from '@/types/notifications';
import openNotification from '@/api/notifications';

export default function useNotification() {
  /**
   * Adds an error message in the notifications queue
   * @param message
   * @param duration
   * @param placement
   */
  const error = useCallback(
    (
      message: string,
      duration: number = 5,
      placement: Placement = 'bottomRight',
      key?: React.Key
    ) => {
      openNotification('error', message, duration, placement, key);
    },
    []
  );

  /**
   * Adds a warning message in the notifications queue
   * @param message
   * @param duration
   * @param placement
   */
  const warning = useCallback(
    (
      message: string,
      duration: number = 5,
      placement: Placement = 'bottomRight',
      key?: React.Key
    ) => {
      openNotification('warning', message, duration, placement, key);
    },
    []
  );

  /**
   * Adds a success message in the notifications queue
   * @param message
   * @param duration
   * @param placement
   */
  const success = useCallback(
    (
      message: string,
      duration: number = 5,
      placement: Placement = 'bottomRight',
      key?: React.Key
    ) => {
      openNotification('success', message, duration, placement, key);
    },
    []
  );

  /**
   * Adds an info message in the notifications queue
   * @param message
   * @param duration
   * @param placement
   */
  const info = useCallback(
    (
      message: string,
      duration: number = 5,
      placement: Placement = 'bottomRight',
      key?: React.Key
    ) => {
      openNotification('info', message, duration, placement, key);
    },
    []
  );

  return { error, warning, success, info };
}
