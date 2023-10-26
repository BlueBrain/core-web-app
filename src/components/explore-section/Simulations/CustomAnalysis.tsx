import { useEffect, useMemo, useRef, useState } from 'react';
import { Spin, notification } from 'antd';
import JSZip from 'jszip';
import { Session } from 'next-auth';
import { LoadingOutlined } from '@ant-design/icons';
import {
  ExtendedCumAnalysisReport,
  Contribution,
  CumulativeAnalysisReport,
  MultipleSimulationCampaignAnalysis,
} from './types';
import DimensionSelector from './DimensionSelector';
import SimulationsDisplayGrid from './SimulationsDisplayGrid';
import { SimulationCampaignResource } from '@/types/explore-section/resources';
import { useSessionAtomValue } from '@/hooks/hooks';
import { useAnalyses, Analysis } from '@/app/explore/(content)/simulation-campaigns/shared';
import { createHeaders } from '@/util/utils';
import { createWorkflowConfigResource, fetchFileByUrl, fetchResourceById } from '@/api/nexus';
import { WorkflowExecution } from '@/types/nexus';
import { composeUrl } from '@/util/nexus';
import { launchWorkflowTask } from '@/services/bbp-workflow';

export default function CustomAnalysis({
  resource,
  analysisId,
}: {
  resource: SimulationCampaignResource;
  analysisId: string;
}) {
  const [launchingAnalysis, setLaunchingAnalysis] = useState(false);
  const [report, fetching] = useCumulativeAnalysisReports(resource, analysisId);
  const session = useSessionAtomValue();
  const [analyses] = useAnalyses();

  const analysesById = useMemo(
    () =>
      analyses.reduce((acc: { [id: string]: Analysis }, item) => {
        acc[item['@id']] = item;
        return acc;
      }, {}),
    [analyses]
  );

  const customReportIds = useMemo(() => report?.hasPart?.map((r) => r['@id']), [report]);

  return (
    <>
      {report?.multiAnalysis.status === 'Done' && (
        <>
          <DimensionSelector coords={resource.parameter?.coords} />
          <SimulationsDisplayGrid status="Done" customReportIds={customReportIds} />
        </>
      )}

      {fetching && (
        <div className="flex justify-center items-center" style={{ height: 200 }}>
          <Spin indicator={<LoadingOutlined />} />
        </div>
      )}

      {report?.multiAnalysis.status === 'Running' && !fetching && (
        <span>Running Analysis ... </span>
      )}

      {!report && !fetching && (
        <div className="flex justify-center items-center" style={{ height: 200 }}>
          <button
            type="button"
            className="px-8 py-4 bg-green-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 max-w-sm"
            onClick={() => {
              setLaunchingAnalysis(true);
              launchAnalysis(resource, analysesById[analysisId], session);
            }}
            disabled={launchingAnalysis}
          >
            {!launchingAnalysis && <span>Launch Analysis</span>}
            {launchingAnalysis && <span>Launching...</span>}
          </button>
        </div>
      )}
    </>
  );
}

function useCumulativeAnalysisReports(
  simCampaign: SimulationCampaignResource,
  analysisId: string
): [ExtendedCumAnalysisReport | undefined, boolean] {
  const session = useSessionAtomValue();
  const [report, setReport] = useState<ExtendedCumAnalysisReport>();
  const [fetching, setFetching] = useState(true);
  const intervalRef = useRef<number>();
  const fetchingRef = useRef<boolean>(false);

  useEffect(() => {
    async function fetchCumulativeReports() {
      if (!session || fetchingRef.current) return;
      fetchingRef.current = true;
      const res: { _results: { '@id': string; '@type': string; _deprecated: boolean }[] } =
        await fetch(simCampaign._incoming, {
          headers: createHeaders(session.accessToken),
        }).then((r) => r.json());

      const cumulativeAnalysisReportLinks = res._results.filter(
        (l) => l['@type'].includes('CumulativeAnalysisReport') && l._deprecated === false
      );

      // Fetch CumulativeAnalysis reports
      const cumulativeAnalysisReports = await Promise.all<CumulativeAnalysisReport>(
        cumulativeAnalysisReportLinks.map((l) => fetchResourceById(l['@id'], session))
      );

      // Fetch the contribution (containing AnalysisSoftwareSourceCode)
      const cumulativeReportsWithContrib = await Promise.all(
        cumulativeAnalysisReports.map(async (cr) => {
          const contribution: Contribution = await fetchResourceById(
            cr.contribution['@id'],
            session
          );
          return { ...cr, contribution };
        })
      );

      // Newest first
      cumulativeReportsWithContrib.sort((a, b) => {
        const dateA = new Date(a._createdAt);
        const dateB = new Date(b._createdAt);
        // @ts-ignore
        return dateB - dateA;
      });

      const foundReport = cumulativeReportsWithContrib.find(
        (r) => r.contribution.agent['@id'] === analysisId
      );

      const multiAnalysis =
        foundReport &&
        (await fetchResourceById<MultipleSimulationCampaignAnalysis>(
          foundReport.wasGeneratedBy['@id'],
          session
        ));

      setReport(multiAnalysis && { ...foundReport, multiAnalysis });
      setFetching(false);
      fetchingRef.current = false;
      if (multiAnalysis?.status === 'Done') window.clearInterval(intervalRef.current); // stop polling if task is done
    }
    fetchCumulativeReports();
    intervalRef.current = window.setInterval(fetchCumulativeReports, 2000); // Refetch every minute to check for task status
    return () => window.clearInterval(intervalRef.current);
  }, [simCampaign, session, setFetching, analysisId]);
  return [report, fetching];
}

async function launchAnalysis(
  simCampaign: SimulationCampaignResource,
  analysis: Analysis | undefined,
  session: Session | null
) {
  if (!simCampaign.wasGeneratedBy || !session || !analysis) return;
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
}
