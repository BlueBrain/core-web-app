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
    (message: string, duration: number = 5, placement: Placement = 'bottomRight') => {
      openNotification('error', message, duration, placement);
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
    (message: string, duration: number = 5, placement: Placement = 'bottomRight') => {
      openNotification('warning', message, duration, placement);
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
    (message: string, duration: number = 5, placement: Placement = 'bottomRight') => {
      openNotification('success', message, duration, placement);
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
    (message: string, duration: number = 5, placement: Placement = 'bottomRight') => {
      openNotification('info', message, duration, placement);
    },
    []
  );

  return { error, warning, success, info };
}
