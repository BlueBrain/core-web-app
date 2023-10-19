import { useEffect, useMemo, useState } from 'react';
import { notification } from 'antd';
import JSZip from 'jszip';
import { Session } from 'next-auth';
import { SimulationCampaignResource } from '@/types/explore-section/resources';
import { useSessionAtomValue } from '@/hooks/hooks';
import { useAnalyses, Analysis } from '@/app/explore/(content)/simulation-campaigns/shared';
import { createHeaders } from '@/util/utils';
import {
  createWorkflowConfigResource,
  fetchFileByUrl,
  fetchResourceById,
  updateResource,
} from '@/api/nexus';
import { Entity, WorkflowExecution } from '@/types/nexus';
import { composeUrl } from '@/util/nexus';
import { launchWorkflowTask } from '@/services/bbp-workflow';

export default function CustomAnalysis({
  resource,
  selectedDisplay,
}: {
  resource: SimulationCampaignResource;
  selectedDisplay: string;
}) {
  const [outputs, fetchingOutputs] = useAnalysisOutputs(resource);
  const [loading, setLoading] = useState(false);
  const session = useSessionAtomValue();
  const [analyses] = useAnalyses();

  const analysesById = useMemo(
    () =>
      analyses.reduce((acc, item) => {
        acc[item['@id']] = item;
        return acc;
      }, {} as { [id: string]: Analysis }),
    [analyses]
  );

  console.log('outputs', outputs);
  console.log('fetchingOutputs', fetchingOutputs);

  return (
    <>
      {false && !outputs.length && !fetchingOutputs && <span>Running Analysis ... </span>}

      {!outputs.length && !fetchingOutputs && (
        <div className="flex justify-center items-center" style={{ height: 200 }}>
          <button
            type="button"
            className="px-8 py-4 bg-green-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 max-w-sm"
            onClick={() =>
              launchAnalysis(resource, analysesById[selectedDisplay], setLoading, session)
            }
            disabled={loading}
          >
            {!loading && <span>Launch Analysis</span>}
            {loading && <span>Launching...</span>}
          </button>
        </div>
      )}

      {!!outputs.length && (
        <div>
          {outputs.map((o, i) => {
            const src = URL.createObjectURL(o);
            /* eslint-disable-next-line @next/next/no-img-element, react/no-array-index-key */
            return <img key={i} alt="analysis" src={src} width={300} />;
          })}
        </div>
      )}
    </>
  );
}

function useAnalysisOutputs(simCampaign: SimulationCampaignResource): [Blob[], boolean] {
  const session = useSessionAtomValue();
  const [outputs, setOutputs] = useState<Blob[]>([]);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    async function fetchIncoming() {
      if (!session) return;
      setFetching(true);
      const res: { _results: { '@id': string; '@type': 'string'; _deprecated: boolean }[] } =
        await fetch(simCampaign._incoming, {
          headers: createHeaders(session.accessToken),
        }).then((r) => r.json());

      const outputLinks = res._results.filter(
        (l) => l['@type'].includes('CumulativeAnalysisReport') && l._deprecated === false
      );

      // Todo find sourceCode
      setFetching(false);

      return;

      if (!outputLink) {
        setFetching(false);
        return;
      }

      const outputUrls = (
        await fetchResourceById<{ hasPart: Entity[] }>(outputLink['@id'], session)
      ).hasPart.map((id) => id['@id']);

      const outputEntities = await Promise.all(
        outputUrls.map((url) =>
          fetchResourceById<Entity & { distribution: { contentUrl: string } }>(url, session)
        )
      );

      const outputImageUrls = outputEntities.map((o) => o.distribution.contentUrl);
      const imagesRes = await Promise.all(outputImageUrls.map((u) => fetchFileByUrl(u, session)));
      const images = await Promise.all(imagesRes.map((r) => r.blob()));
      setFetching(false);
      setOutputs(images);
    }
    fetchIncoming();
  }, [simCampaign, session]);
  return [outputs, fetching];
}

async function launchAnalysis(
  simCampaign: SimulationCampaignResource,
  analysis: Analysis | undefined,
  setLoading: (value: boolean) => void,
  session: Session | null
) {
  if (!simCampaign.wasGeneratedBy || !session || !analysis) return;
  setLoading(true);
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
  let config = await zip.file('simulation.cfg')?.async('string');
  const m = config?.match(/\[DEFAULT\][\s\S]+?\[RunSimCampaignMeta\][\s\S]+?rev=1/g);

  if (!(config = m?.[0])) return; // eslint-disable-line

  // TODO: Figure out how to handle custom config later
  const multiAnalyseSimCampaignMeta = `[MultiAnalyseSimCampaign]
workspace-prefix: /gpfs/bbp.cscs.ch/data/scratch/proj134/home/${session.user.username}/SBO/analysis
analysis-configs: [
  {
    "AnalyseSimCampaign":  {
      "source_code_url": "${analysis['@id']}",
        "analysis_config": {
          "simulation_campaign": "$SIMULATION_CAMPAIGN_FILE",
          "output": "$SCRATCH_PATH",
          "report_type": "spikes",
          "report_name": "raster",
          "node_sets": ["AAA"],
          "cell_step": 1

        }
    },
    
    "CloneGitRepo": {
      "git_url": "${analysis.codeRepository['@id']}",
      "git_ref": "${analysis.branch}",
      "subdirectory": "${analysis.subdirectory}",
      "git_user": "GUEST",
      "git_password": "WCY_qpuGG8xpKz_S8RNg"
    }
  }]`;

  const newResource = await createWorkflowConfigResource(
    'analysis.cfg',
    multiAnalyseSimCampaignMeta,
    session
  );

  const urlWithRev = composeUrl('resource', newResource['@id'], {
    rev: newResource._rev,
  }).replaceAll('%', '%%');

  // Todo handle Git authentication later

  config += `
  
    [MultiAnalyseSimCampaignMeta]
    config-url: ${urlWithRev}
  
    [MultiAnalyseSimCampaign]
    time: 8:00:00
    `;

  await launchWorkflowTask({
    loginInfo: session,
    workflowName: 'bbp_workflow.sbo.analysis.task.MultiAnalyseSimCampaignMeta/',
    workflowFiles: [
      {
        NAME: 'config.cfg',
        TYPE: 'file',
        CONTENT: config,
      },
      { NAME: 'cfg_name', TYPE: 'string', CONTENT: 'config.cfg' },
    ],
  });

  notification.success({
    message: 'Workflow launched successfuly',
    description: (
      <span>
        You can watch the progress of launched tasks in your{' '}
        <a
          href={`https://bbp-workflow-${session.user.username}.kcp.bbp.epfl.ch/static/visualiser/index.html#order=4%2Cdesc`}
          target="_blank"
        >
          Workflow dashboard
        </a>
        .
      </span>
    ),
    duration: 10,
  });

  setLoading(false);
}
