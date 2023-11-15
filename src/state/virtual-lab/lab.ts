import { atom } from 'jotai';
import sessionAtom from '../session';
import { VirtualLab } from '@/services/virtual-lab/types';
import VirtualLabService from '@/services/virtual-lab/virtual-lab-service';

export const getVirtualLabAtom = (labId: string) =>
  atom<Promise<VirtualLab | null>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) return null;

    const service = new VirtualLabService();
    return service.get(session.user, labId);
  });

export const getComputeTimeAtom = (labId: string) =>
  atom(async (get) => {
    const session = get(sessionAtom);
    if (!session) return null;

    const service = new VirtualLabService();
    return service.getComputeTime(labId);
  });
