import { Session } from 'next-auth';
import { Analysis } from '@/app/explore/(content)/simulation-campaigns/shared';
import { to64 } from '@/util/common';
import { createWorkflowConfigResource } from '@/api/nexus';
import { composeUrl } from '@/util/nexus';

/**
 * Builds the simulation detail view URL
 *
 * @param org
 * @param proj
 * @param simulationID
 * @param existingPath
 */
export function buildSimulationDetailURL(
  org?: string,
  proj?: string,
  simulationID?: string,
  existingPath?: string | null
) {
  if (!existingPath || !simulationID || !org || !proj) {
    throw new Error('Simulation detail URL cannot be build');
  }
  return `${existingPath}/simulations/${to64(`${org}/${proj}!/!${simulationID}`)}`;
}

// TODO: Figure out how to handle custom config later
// TODO: Remove temporary git user and password
function getMultiAnalysisWorkflowConfig(
  analysis: Analysis[],
  targets: string[][],
  session: Session
) {
  const configs = analysis.map(
    (a, i) => `{"AnalyseSimCampaign":  {
      "source_code_url": "${a['@id']}",
        "analysis_config": {
          "simulation_campaign": "$SIMULATION_CAMPAIGN_FILE",
          "output": "$SCRATCH_PATH",
          "report_type": "spikes",
          "report_name": "raster",
          "node_sets": ${JSON.stringify(targets[i] && targets[i].length ? targets[i] : ['AAA'])}, 
          "cell_step": 1

        }
    }, "CloneGitRepo": {
      "git_url": "${a.codeRepository['@id']}",
      "git_ref": "${a.branch}",
      "subdirectory": "${a.subdirectory}",
      "git_user": "GUEST",
      "git_password": "WCY_qpuGG8xpKz_S8RNg"}}`
  );

  return `[MultiAnalyseSimCampaign]
  time: 8:00:00
  workspace-prefix: /gpfs/bbp.cscs.ch/data/scratch/proj134/home/${session.user.username}/SBO/analysis
  analysis-configs: [${configs}]`;
}

function getMultiAnalyseSimCampaignMetaConfig(url: string) {
  return `
  
  [MultiAnalyseSimCampaignMeta]
  config-url: ${url}
  `;
}

export async function getConfigWithMultiAnalysis(
  config: string,
  analysis: Analysis[],
  targets: string[][],
  session: Session
) {
  const multiAnalyseSimCampaignMeta = getMultiAnalysisWorkflowConfig(analysis, targets, session);

  const newResource = await createWorkflowConfigResource(
    'analysis.cfg',
    multiAnalyseSimCampaignMeta,
    session
  );

  const urlWithRev = composeUrl('resource', newResource['@id'], {
    rev: newResource._rev,
  }).replaceAll('%', '%%');

  return config.concat(getMultiAnalyseSimCampaignMetaConfig(urlWithRev));
}
