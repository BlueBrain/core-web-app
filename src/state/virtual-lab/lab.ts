import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';
import sessionAtom from '../session';
import getVirtualLabDetail from '@/services/virtual-lab/labs';
import { VirtualLab } from '@/types/virtual-lab/lab';

export const virtualLabDetailAtomFamily = atomFamily((virtualLabId: string) =>
  atom<Promise<VirtualLab | null>>(async () => {
    const response = await getVirtualLabDetail(virtualLabId);
    return response.data.virtual_lab;
  })
);

export const currentVirtualLabIdAtom = atom<string | null>(null);

export const virtualLabsForUserAtom = () =>
  atom<Promise<VirtualLab[]>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) return [];

    // const allLabs = await new VirtualLabService().listAll(session.user);
    // return allLabs;
  });

export const getVirtualLabAtom = (labId: string) =>
  atom<Promise<VirtualLab | null>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) return null;

    // const service = new VirtualLabService();
    // return service.get(session.user, labId);
  });

export const getComputeTimeAtom = (labId: string) =>
  atom(async (get) => {
    const session = get(sessionAtom);
    if (!session) return null;

    // const service = new VirtualLabService();
    // return service.getComputeTime(labId);
  });
