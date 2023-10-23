import { useEffect, useMemo, useState } from 'react';
import { Spin, notification } from 'antd';
import JSZip from 'jszip';
import { Session } from 'next-auth';
import { uniqBy } from 'lodash/fp';
import CustomAnalysisReport from './CustomAnalysisReport';
import { CumulativeAnalysisReportWContrib, Contribution, CumulativeAnalysisReport } from './types';
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
  const [reports, fetchingReports] = useCumulativeAnalysisReports(resource);
  const [loading, setLoading] = useState(false);
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

  const report: CumulativeAnalysisReportWContrib | undefined = reports[analysisId];

  return (
    <>
      {report && <CustomAnalysisReport cumulativeReport={report} />}
      {fetchingReports && (
        <div className="flex justify-center items-center" style={{ height: 200 }}>
          <Spin />
        </div>
      )}
      {false && !reports.length && !fetchingReports && <span>Running Analysis ... </span>}

      {!reports.length && !fetchingReports && (
        <div className="flex justify-center items-center" style={{ height: 200 }}>
          <button
            type="button"
            className="px-8 py-4 bg-green-500 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 max-w-sm"
            onClick={() => launchAnalysis(resource, analysesById[analysisId], setLoading, session)}
            disabled={loading}
          >
            {!loading && <span>Launch Analysis</span>}
            {loading && <span>Launching...</span>}
          </button>
        </div>
      )}
    </>
  );
}

function useCumulativeAnalysisReports(simCampaign: SimulationCampaignResource): [
  {
    [analysisId: string]: CumulativeAnalysisReportWContrib;
  },
  boolean
] {
  const session = useSessionAtomValue();
  const [reports, setReports] = useState<{
    [analysisId: string]: CumulativeAnalysisReportWContrib;
  }>({});
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    async function fetchIncoming() {
      if (!session) return;
      setFetching(true);
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

      // Only the latest CumulativeAnalysisReport for each AnalysisSoftwareSource
      const uniqueReports = uniqBy(
        (cr) => cr.contribution.agent['@id'],
        cumulativeReportsWithContrib
      );

      const reportsByAnalysisId = uniqueReports.reduce(
        (acc: { [id: string]: CumulativeAnalysisReportWContrib }, report) => {
          acc[report.contribution.agent['@id']] = report;
          return acc;
        },
        {}
      );

      setReports(reportsByAnalysisId);
      setFetching(false);
    }
    fetchIncoming();
  }, [simCampaign, session]);
  return [reports, fetching];
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
