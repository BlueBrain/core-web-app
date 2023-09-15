import { useEffect, useMemo, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { PlusOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { SimulationCampaignResource } from '@/types/explore-section/resources';
import DimensionSelector from '@/components/explore-section/Simulations/DimensionSelector';
import SimulationsDisplayGrid from '@/components/explore-section/Simulations/SimulationsDisplayGrid';
import { initializeDimensionsAtom } from '@/components/explore-section/Simulations/state';
import { simulationsCountAtom } from '@/state/explore-section/simulation-campaign';
import SimulationOptionsDropdown from '@/components/explore-section/Simulations/DisplayDropdown';
import {
  displayOptions,
  showOnlyOptions,
} from '@/components/explore-section/Simulations/constants';
import { useAnalyses, Analysis } from '@/app/explore/(content)/simulation-campaigns/shared';
import usePathname from '@/hooks/pathname';
import { fetchFileByUrl, fetchResourceById } from '@/api/nexus';
import { useSession } from '@/hooks/hooks';
import { WorkflowExecution } from '@/types/nexus';
import JSZip from 'jszip';
import { Session } from 'next-auth';

export default function Simulations({ resource }: { resource: SimulationCampaignResource }) {
  const [selectedDisplay, setSelectedDisplay] = useState<string>('raster');
  const [showStatus, setShowStatus] = useState<string>('all');

  const setDefaultDimensions = useSetAtom(initializeDimensionsAtom);
  const simulationsCount = useAtomValue(simulationsCountAtom);
  const [analyses] = useAnalyses();
  const session = useSession();

  const analysesById = useMemo(
    () =>
      analyses.reduce((acc, item) => {
        acc[item['@id']] = item;
        return acc;
      }, {} as { [id: string]: Analysis }),
    [analyses]
  );
  const path = usePathname();
  const isCustom = useMemo(
    () => !displayOptions.map((o) => o.value).includes(selectedDisplay),
    [selectedDisplay]
  );

  useEffect(() => {
    setDefaultDimensions();
  }, [resource, setDefaultDimensions]);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex gap-4 items-center justify-end text-primary-7">
        <div className="flex gap-2 items-baseline mr-auto">
          <span className="font-bold text-xl">Simulations</span>
          <span className="text-xs">{simulationsCount} simulations</span>
        </div>
        <div>
          <span className="mr-2 font-light text-primary-8">Show:</span>
          <SimulationOptionsDropdown
            options={showOnlyOptions}
            setSelectedValue={setShowStatus}
            selectedValue={showStatus}
          />
        </div>
        <div>
          <span className="mr-2 font-light text-primary-8">Display:</span>
          <SimulationOptionsDropdown
            setSelectedValue={setSelectedDisplay}
            selectedValue={selectedDisplay}
            options={[
              ...displayOptions,
              ...analyses.map((a) => ({ label: a.name, value: a['@id'] })),
            ]}
          />
          <Link href={`${path}/experiment-analysis`}>
            <PlusOutlined className="text-2xl ml-2 translate-y-[2px]" />
          </Link>
        </div>
      </div>
      {!isCustom && (
        <>
          <DimensionSelector coords={resource.parameter?.coords} />
          <SimulationsDisplayGrid display={selectedDisplay} status={showStatus} />
        </>
      )}
      {isCustom && (
        <div className="flex justify-center items-center" style={{ height: 200 }}>
          <button
            type="button"
            className="px-8 py-4 bg-green-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 max-w-sm"
            onClick={() => launchAnalysis(resource, analysesById[selectedDisplay], session)}
          >
            Launch Analysis
          </button>
        </div>
      )}
    </div>
  );
}

async function launchAnalysis(
  simCampaign: SimulationCampaignResource,
  analysis: Analysis | undefined,
  session: Session | null
) {
  console.log(analysis);
  if (!simCampaign.wasGeneratedBy || !session || !analysis) return null;
  const execution = await fetchResourceById<{ wasInfluencedBy: { '@id': string } }>(
    simCampaign.wasGeneratedBy['@id'],
    session
  );
  const workflowExecution = await fetchResourceById<WorkflowExecution>(
    execution.wasInfluencedBy['@id'],
    session
  );

  const workflowConfig = await fetchFileByUrl(workflowExecution.distribution.contentUrl, session);

  const workflowConfigPayload = await workflowConfig.blob();
  const jszip = new JSZip();
  const zip = await jszip.loadAsync(workflowConfigPayload);
  const config = await zip.file('simulation.cfg')?.async('string');
  return config?.match(/(\[DEFAULT\][\s\S]+)\[ReportsSimCampaignMeta\]/);
}
