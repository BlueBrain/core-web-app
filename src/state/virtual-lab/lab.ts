import { RefObject } from 'react';
import { PrimitiveAtom, atom } from 'jotai';
import { atomFamily, atomWithDefault, atomWithRefresh, atomWithReset } from 'jotai/utils';

import sessionAtom from '../session';

import {
  getVirtualLabDetail,
  getVirtualLabUsers,
  getVirtualLabsOfUser,
  getPlans,
} from '@/services/virtual-lab/labs';
import { VirtualLab } from '@/types/virtual-lab/lab';
import { VirtualLabAPIListData } from '@/types/virtual-lab/common';
import { VirtualLabMember } from '@/types/virtual-lab/members';
import {
  getVirtualLabBalanceDetails,
  getVirtualLabPaymentMethods,
} from '@/services/virtual-lab/billing';
import { PaymentMethod, VlabBudget } from '@/types/virtual-lab/billing';

export const refreshAtom = atom(0);

export const virtualLabDetailAtomFamily = atomFamily<
  string,
  PrimitiveAtom<Promise<VirtualLab | undefined>>
>((virtualLabId) =>
  atomWithDefault(async (get) => {
    const session = get(sessionAtom);
    if (!session) {
      return;
    }
    const response = await getVirtualLabDetail(virtualLabId, session.accessToken);

    return response.data.virtual_lab;
  })
);

export const virtualLabMembersAtomFamily = atomFamily((virtualLabId: string) =>
  atom<Promise<VirtualLabMember[] | undefined>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) {
      return;
    }
    const response = await getVirtualLabUsers(virtualLabId, session.accessToken);
    return response.data.users;
  })
);

export const transactionFormStateAtom = atomWithReset<{
  credit: string;
  selectedPaymentMethodId?: string;
  loading: boolean;
  errors?: {
    credit?: string[] | undefined;
    selectedPaymentMethodId?: string[] | undefined;
    defaultPaymentMethodId?: string[] | undefined;
  };
}>({
  credit: '',
  loading: false,
  errors: undefined,
  selectedPaymentMethodId: undefined,
});

export const virtualLabPaymentMethodsAtomFamily = atomFamily((virtualLabId: string) =>
  atomWithRefresh<Promise<Array<PaymentMethod> | undefined>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) {
      return;
    }
    const response = await getVirtualLabPaymentMethods(virtualLabId, session.accessToken);
    return response.data.payment_methods;
  })
);

export const virtualLabBalanceAtomFamily = atomFamily((virtualLabId: string) =>
  atomWithRefresh<Promise<VlabBudget | undefined>>(async (get) => {
    const session = get(sessionAtom);
    if (!session) {
      return;
    }
    const response = await getVirtualLabBalanceDetails(virtualLabId, session.accessToken);
    return response.data;
  })
);

export const virtualLabsOfUserAtom = atomWithRefresh<
  Promise<VirtualLabAPIListData<VirtualLab> | undefined>
>(async (get) => {
  const session = get(sessionAtom);
  get(refreshAtom);
  if (!session) {
    return;
  }
  const response = await getVirtualLabsOfUser(session.accessToken);
  return response.data;
});

export const projectTopMenuRefAtom = atom<RefObject<HTMLDivElement> | null>(null);

export const userVirtualLabTotalsAtom = atom<Promise<number | undefined>>(async (get) => {
  const session = get(sessionAtom);
  if (!session) {
    return;
  }
  const virtualLabs = await get(virtualLabsOfUserAtom);
  return virtualLabs?.total || 0;
});

export const virtualLabPlansAtom = atom<
  Promise<
    | Array<{
        id: number;
        name: string;
        price: number;
        features: Record<string, Array<string>>;
      }>
    | undefined
  >
>(async (get) => {
  const session = get(sessionAtom);
  if (!session) {
    return;
  }
  const { data } = await getPlans(session.accessToken);
  const { all_plans: allPlans } = data;

  return allPlans;
});

export const newProjectModalOpenAtom = atom(false);
export const virtualLabIdAtom = atom('');
