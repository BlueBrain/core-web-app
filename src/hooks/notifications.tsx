import { useCallback, Key, useRef } from 'react';
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
      closeIcon: boolean = true,
      key?: Key
    ) => {
      openNotification('error', message, duration, placement, closeIcon, key);
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
      closeIcon: boolean = true,
      key?: Key
    ) => {
      openNotification('warning', message, duration, placement, closeIcon, key);
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
      closeIcon: boolean = true,
      key?: Key
    ) => {
      openNotification('success', message, duration, placement, closeIcon, key);
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
      closeIcon: boolean = true,
      key?: Key
    ) => {
      openNotification('info', message, duration, placement, closeIcon, key);
    },
    []
  );

  return useRef({ error, warning, success, info }).current;
}
