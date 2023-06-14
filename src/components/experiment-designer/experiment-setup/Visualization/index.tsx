import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import isArray from 'lodash/isArray';
import { ExpDesignerSectionName } from '@/types/experiment-designer';
import SimulationPreview from '@/components/experiment-designer/simulation-preview';
import {
  extractTargetNamesFromSection,
  getFocusedAtom,
} from '@/components/experiment-designer/utils';

type VisualizationProps = {
  sectionName: ExpDesignerSectionName;
};

export default function Visualization({ sectionName }: VisualizationProps) {
  const focusedAtom = useMemo(() => {
    const name: ExpDesignerSectionName = sectionName === 'imaging' ? 'setup' : sectionName;
    return getFocusedAtom(name);
  }, [sectionName]);

  const inputSectionParams = useAtomValue(focusedAtom);

  const targetsToDisplay = useMemo(() => {
    const targetsValue: string | string[] = extractTargetNamesFromSection(inputSectionParams);
    return isArray(targetsValue) ? targetsValue : [targetsValue];
  }, [inputSectionParams]);

  return (
    <div className="bg-black flex flex-col justify-center items-center h-full text-white">
      <SimulationPreview targetsToDisplay={targetsToDisplay} />
    </div>
  );
}
