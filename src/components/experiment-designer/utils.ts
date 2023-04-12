import { focusAtom } from 'jotai-optics';
import { OpticFor } from 'optics-ts';
import { expDesignerConfigAtom } from '@/state/experiment-designer';
import type { ExpDesignerConfig, ExpDesignerGroupParameter } from '@/types/experiment-designer';

export function getFocusedAtom(name: string) {
  return focusAtom(expDesignerConfigAtom, (optic: OpticFor<ExpDesignerConfig>) => optic.prop(name));
}

export function cloneLastAndAdd(setSectionConfig: any) {
  setSectionConfig((sectionConfig: ExpDesignerGroupParameter[]) => {
    if (!sectionConfig.length) return [];

    const lastItemClone = structuredClone(sectionConfig.slice(-1)[0]);
    lastItemClone.id = crypto.randomUUID();
    lastItemClone.name = lastItemClone.id;
    sectionConfig.push(lastItemClone);

    return [...sectionConfig];
  });
}

export default getFocusedAtom;
