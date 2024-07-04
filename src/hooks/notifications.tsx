import { useRef } from 'react';
import { error, warning, success, info } from '@/api/notifications';

export default function useNotification() {
  return useRef({ error, warning, success, info }).current;
}
