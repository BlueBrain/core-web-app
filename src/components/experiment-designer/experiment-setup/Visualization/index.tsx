import { useAtomValue, useSetAtom } from 'jotai';
import isArray from 'lodash/isArray';
import { useEffect, useMemo } from 'react';

import SimulationPreview from '@/components/experiment-designer/simulation-preview';
import {
  extractTargetNamesFromSection,
  getFocusedAtom,
} from '@/components/experiment-designer/utils';
import { atlasVisualizationAtom, initializeRootMeshAtom } from '@/state/atlas/atlas';
import { ExpDesignerSectionName } from '@/types/experiment-designer';

type VisualizationProps = {
  sectionName: ExpDesignerSectionName;
};

export default function Visualization({ sectionName }: VisualizationProps) {
  const atlasVisualization = useAtomValue(atlasVisualizationAtom);
  const initRootMesh = useSetAtom(initializeRootMeshAtom);
  useEffect(() => {
    /**
     * We display all the meshes that have been selected in the brain's regions' tree.
     * But if none has been selected yet (most of the time because we don't come from
     * that path), then we need to display at least the whole brain.
     */
    if (atlasVisualization.visibleMeshes.length > 0) return;

    initRootMesh();
  }, [atlasVisualization, initRootMesh]);
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
    <div className="flex h-full flex-col items-center justify-center bg-black text-white">
      <SimulationPreview targetsToDisplay={targetsToDisplay} />
    </div>
  );
}
