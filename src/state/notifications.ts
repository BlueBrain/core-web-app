import { atom } from 'jotai';

export type NotificationType = {
  id: number;
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
  duration: number;
};

const notificationsAtom = atom<NotificationType[]>([]);

export default notificationsAtom;
