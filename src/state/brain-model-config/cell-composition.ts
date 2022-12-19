'use client';

import { atom } from 'jotai';
import { selectAtom } from 'jotai/utils';

import sessionAtom from '../session';
import { getCellCompositionIdAtom } from './index';
import { fetchResourceById, fetchJsonFileById } from '@/api/nexus';
import { CellComposition, CellCompositionConfig } from '@/types/nexus';

export const cellCompositionAtom = atom<Promise<CellComposition | null>>(async (get) => {
  const session = get(sessionAtom);
  const id = await get(getCellCompositionIdAtom);

  if (!session || !id) return null;

  return fetchResourceById<CellComposition>(id, session);
});

export const cellCompositionConfigAtom = atom<Promise<CellCompositionConfig | null>>(
  async (get) => {
    const session = get(sessionAtom);
    const cellComposition = await get(cellCompositionAtom);

    if (!session || !cellComposition) {
      return null;
    }

    const id = cellComposition?.distribution['@id'];

    if (!id) {
      // ? return default value
      return null;
    }

    return fetchJsonFileById<CellCompositionConfig>(id, session);
  }
);

export const createGetProtocolAtom = (entityId: string) => {
  const selectorFn = (cellCompositionConfig: CellCompositionConfig | null) =>
    cellCompositionConfig?.[entityId].hasProtocol;

  return selectAtom(cellCompositionConfigAtom, selectorFn);
};

export const createGetParameterAtom = (entityId: string) => {
  const selectorFn = (cellCompositionConfig: CellCompositionConfig | null) =>
    cellCompositionConfig?.[entityId].hasParameter;

  return selectAtom(cellCompositionConfigAtom, selectorFn);
};

export const createGetConfigurationAtom = (entityId: string) => {
  const selectorFn = (cellCompositionConfig: CellCompositionConfig | null) =>
    cellCompositionConfig?.[entityId].configuration;

  return selectAtom(cellCompositionConfigAtom, selectorFn);
};

export const createGetJobConfigAtom = (entityId: string) => {
  const selectorFn = (cellCompositionConfig: CellCompositionConfig | null) =>
    cellCompositionConfig?.[entityId].jobConfiguration;

  return selectAtom(cellCompositionConfigAtom, selectorFn);
};
