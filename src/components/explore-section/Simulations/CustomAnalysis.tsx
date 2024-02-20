import { useEffect, useMemo, useRef, useState } from 'react';
import { Spin, notification } from 'antd';
import { ISODateString, Session } from 'next-auth';
import { LoadingOutlined, SyncOutlined } from '@ant-design/icons';

import {
  ExtendedCumAnalysisReport,
  CumulativeAnalysisReport,
  MultipleSimulationCampaignAnalysis,
} from './types';
import DimensionSelector from './DimensionSelector';
import SimulationsDisplayGrid from './SimulationsDisplayGrid';
import { fetchSimCampWorkflowConfig, getConfigWithMultiAnalysis, useAnalysisIds } from './utils';
import ScheduledIndicator from './ScheduledIndicator';
import { SimulationCampaign } from '@/types/explore-section/delta-simulation-campaigns';
import { useSessionAtomValue } from '@/hooks/hooks';
import { useAnalyses, Analysis } from '@/app/explore/(content)/simulation-campaigns/shared';
import { createHeaders, formatTimeDifference } from '@/util/utils';
import { fetchResourceById } from '@/api/nexus';
import { launchUnicoreWorkflowSetup, launchWorkflowTask } from '@/services/bbp-workflow';
import { useWorkflowAuth } from '@/components/WorkflowLauncherBtn';

export default function CustomAnalysis({
  resource,
  analysisId,
}: {
  resource: SimulationCampaign;
  analysisId: string;
}) {
  const { ensureWorkflowAuth } = useWorkflowAuth();
  const [launchingAnalysis, setLaunchingAnalysis] = useState(false);
  const [report, fetching] = useCumulativeAnalysisReports(resource, analysisId);
  const session = useSessionAtomValue();
  const [analyses] = useAnalyses();

  const [launchedAnalysisIds, fetchingAnalysisConfigs] = useAnalysisIds(resource);

  const analysisLaunched = useMemo(
    () => launchedAnalysisIds.find((id) => id === analysisId),
    [launchedAnalysisIds, analysisId]
  );

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
      {analysisLaunched && !report && !fetching && <ScheduledIndicator />}

      {report?.multiAnalysis.status === 'Done' && (
        <>
          <DimensionSelector coords={resource.parameter?.coords} />
          <SimulationsDisplayGrid status="all" customReportIds={customReportIds} />
        </>
      )}

      {fetching && (
        <div className="flex items-center justify-center" style={{ height: 200 }}>
          <Spin indicator={<LoadingOutlined />} />
        </div>
      )}

      {report?.multiAnalysis.status === 'Running' && (
        <div className="flex items-center justify-center" style={{ height: 200 }}>
          <RunningAnalysis createdAt={report.multiAnalysis._createdAt} />
        </div>
      )}

      {!report && !fetching && !analysisLaunched && !fetchingAnalysisConfigs && (
        <div className="flex items-center justify-center" style={{ height: 200 }}>
          <button
            type="button"
            className="max-w-sm rounded-lg bg-green-500 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
            onClick={async () => {
              setLaunchingAnalysis(true);
              if (!session) return;
              await launchUnicoreWorkflowSetup(session.accessToken);
              await ensureWorkflowAuth(session.user.username);
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
  simCampaign: SimulationCampaign,
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

      // Newest first
      cumulativeAnalysisReports.sort((a, b) => {
        const dateA = new Date(a._createdAt);
        const dateB = new Date(b._createdAt);
        return dateB.valueOf() - dateA.valueOf();
      });

      const foundReport = cumulativeAnalysisReports.find((r) => {
        if (Array.isArray(r.contribution))
          return r.contribution.find((c) => c.agent['@id'] === analysisId);

        return r.contribution.agent['@id'] === analysisId;
      });

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
    intervalRef.current = window.setInterval(fetchCumulativeReports, 3600); // Refetch every minute to check for task status
    return () => window.clearInterval(intervalRef.current);
  }, [simCampaign, session, setFetching, analysisId]);
  return [report, fetching];
}

async function launchAnalysis(
  simCampaign: SimulationCampaign,
  analysis: Analysis | undefined,
  session: Session | null
) {
  if (!simCampaign.wasGeneratedBy || !session || !analysis) return;

  const fullConfig = await fetchSimCampWorkflowConfig(simCampaign, session);
  let config = fullConfig?.match(/\[DEFAULT\][\s\S]+?\[RunSimCampaignMeta\][\s\S]+?rev=1/g)?.[0];

  if (!config) return;

  config = await getConfigWithMultiAnalysis(config, [analysis], [], session);

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

function RunningAnalysis({ createdAt }: { createdAt: ISODateString }) {
  const [executionTime, setExecutionTime] = useState('');

  useEffect(() => {
    function computeExecutionTime() {
      const startTime = new Date(createdAt);
      const currentTime = new Date();
      const difference = Math.floor((currentTime.valueOf() - startTime.valueOf()) / 1000); // in seconds
      setExecutionTime(formatTimeDifference(difference));
    }
    computeExecutionTime();
    const interval = setInterval(computeExecutionTime, 1000);
    return () => clearInterval(interval);
  }, [createdAt]);

  if (!executionTime) return null;

  return (
    <div className="flex items-center space-x-4 rounded-md bg-blue-100 p-4 shadow-md">
      <SyncOutlined className="text-2xl text-blue-500" spin />
      <div className="text-blue-600">
        <div className="font-semibold">Running analysis...</div>
        <div className="mt-1 text-sm">Started: {executionTime} ago</div>
      </div>
    </div>
  );
}
