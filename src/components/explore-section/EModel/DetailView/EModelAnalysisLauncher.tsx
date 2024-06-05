import { Button, notification } from 'antd';
import { Session } from 'next-auth';
import { useEffect, useState } from 'react';
import { RunningAnalysis, useCumulativeAnalysisReports } from '../../Simulations/CustomAnalysis';
import { getEModelAnalysisWorkflowConfig } from '@/components/explore-section/Simulations/utils';
import { Analysis } from '@/app/explore/(content)/simulation-campaigns/shared';
import { createWorkflowConfigResource, fetchResourceById } from '@/api/nexus';
import { composeUrl } from '@/util/nexus';
import { launchWorkflowTask, launchUnicoreWorkflowSetup } from '@/services/bbp-workflow';
import { EModelResource } from '@/types/explore-section/delta-model';
import { useSessionAtomValue, useUnwrappedValue } from '@/hooks/hooks';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import { detailFamily } from '@/state/explore-section/detail-view-atoms';
import PDFViewer from '@/components/explore-section/EModel/DetailView/PDFViewer';
import { useWorkflowAuth } from '@/components/WorkflowLauncherBtn';

export default function Launcher({ analysis }: { analysis?: Analysis }) {
  const { ensureWorkflowAuth } = useWorkflowAuth();
  const resourceInfo = useResourceInfoFromPath();
  const eModel = useUnwrappedValue(detailFamily(resourceInfo)) as EModelResource;
  const session = useSessionAtomValue();
  const [report, fetching] = useCumulativeAnalysisReports(eModel?._incoming, analysis?.['@id']);
  const [launching, setLaunching] = useState(false);
  const [analysisStarted, setAnalysisStartedStated] = useState('');
  const [analysisPDFUrl, setAnalysisPDFURL] = useState('');

  useEffect(() => {
    async function fetchReport() {
      if (!report || !report.hasPart?.length || !session) {
        setAnalysisPDFURL('');
        return;
      }

      const res: { distribution: { contentUrl: string } } = await fetchResourceById(
        report.hasPart[0]['@id'],
        session
      );
      setAnalysisPDFURL(res.distribution.contentUrl);
    }

    fetchReport();
  }, [report, session]);

  if (!analysis || !eModel) return null;

  return (
    <>
      {!report && !analysisStarted && !fetching && (
        <div>
          <div>{analysis.description}</div>
          <Button
            className="float-right"
            size="large"
            type="primary"
            onClick={async () => {
              if (launching || !session) return;
              setLaunching(true);
              await launchUnicoreWorkflowSetup(session.accessToken);
              await ensureWorkflowAuth(session.user.username);
              await launchAnalysis(eModel?.['@id'], analysis, session);
              setAnalysisStartedStated(new Date().toISOString());
            }}
            disabled={launching}
          >
            {launching && <span>Launching analysis ...</span>}
            {!launching && <span>Launch analysis</span>}
          </Button>
          {/* Clearfix fixes weird vertical alignment issue from float-right */}
          <div className="clear-both" />
        </div>
      )}

      {(!report || !analysisPDFUrl) && analysisStarted && (
        <div className="mt-5 flex items-center justify-center">
          <RunningAnalysis createdAt={analysisStarted} />
        </div>
      )}
      {analysisPDFUrl && <PDFViewer url={analysisPDFUrl} />}
    </>
  );
}

async function launchAnalysis(
  eModelId: string | undefined,
  analysis: Analysis | undefined,
  session: Session | null
) {
  if (!session || !analysis || !eModelId) return;

  const newResource = await createWorkflowConfigResource(
    'analysis.cfg',
    getEModelAnalysisWorkflowConfig(eModelId, [analysis], session),
    session
  );

  const urlWithRev = composeUrl('resource', newResource['@id'], {
    rev: newResource._rev,
  }).replaceAll('%', '%%');

  const config = `
  [DEFAULT]
  kg-base: https://bbp.epfl.ch/nexus/v1
  kg-org: bbp
  kg-proj: mmb-point-neuron-framework-model
  account: proj134
  
  [MultiAnalyseEModelMeta]
  config-url: ${urlWithRev}
  `;

  await launchWorkflowTask({
    loginInfo: session,
    workflowName: 'bbp_workflow.sbo.analysis.task.MultiAnalyseEModelMeta/',
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
