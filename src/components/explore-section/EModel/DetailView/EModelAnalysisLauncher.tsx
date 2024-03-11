import { Button } from 'antd';
import { Session } from 'next-auth';
import { getEModelAnalysisWorkflowConfig } from '@/components/explore-section/Simulations/utils';
import { Analysis } from '@/app/explore/(content)/simulation-campaigns/shared';
import { createWorkflowConfigResource } from '@/api/nexus';
import { composeUrl } from '@/util/nexus';
import { launchWorkflowTask } from '@/services/bbp-workflow';
import { EModelResource } from '@/types/explore-section/delta-model';
import { useSessionAtomValue, useUnwrappedValue } from '@/hooks/hooks';
import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';
import { detailFamily } from '@/state/explore-section/detail-view-atoms';

export default function Launcher() {
  const resourceInfo = useResourceInfoFromPath();
  const eModel = useUnwrappedValue<Promise<EModelResource>>(detailFamily(resourceInfo));
  const session = useSessionAtomValue();

  return (
    <>
      <Button
        className="float-right"
        size="large"
        type="primary"
        onClick={() => launchAnalysis(eModel?.['@id'], undefined, session)}
      >
        Launch Analysis
      </Button>

      {/* Clearfix fixes weird vertical alignment issue from float-right */}
      <div className="clear-both" />
    </>
  );
}

async function launchAnalysis(
  eModelId: string | undefined,
  analysis: Analysis | undefined,
  session: Session | null
) {
  if (!session || !eModelId) return;

  analysis = {
    '@id':
      'https://bbp.epfl.ch/data/bbp/mmb-point-neuron-framework-model/93b6eef6-a3db-4b51-a5ba-d2fa6cf936a8',
    codeRepository: {
      '@id': 'https://github.com/BlueBrain/blueetl.git',
    },
    branch: 'custom-analyses',
    subdirectory: 'custom_analyses/src/emodel_00',
  } as Analysis;

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
}
