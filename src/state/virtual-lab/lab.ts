import { RefObject } from 'react';
import { atom } from 'jotai';
import sessionAtom from '../session';
import { VirtualLab } from '@/services/virtual-lab/types';
import VirtualLabService from '@/services/virtual-lab/virtual-lab-service';

export const currentVirtualLabIdAtom = atom<string | null>(null);

export const virtualLabsForUserAtom = () =>
  atom<Promise<VirtualLab[]>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) return [];

    const allLabs = await new VirtualLabService().listAll(session.user);
    return allLabs;
  });

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

export const projectTopMenuRefAtom = atom<RefObject<HTMLDivElement> | null>(null);
