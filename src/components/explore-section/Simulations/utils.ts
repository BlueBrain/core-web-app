import { Session } from 'next-auth';
import { Analysis } from '@/app/explore/(content)/simulation-campaigns/shared';
import { to64 } from '@/util/common';

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
export function getMultiAnalysisWorkflowConfig(analysis: Analysis, session: Session) {
  return `[MultiAnalyseSimCampaign]
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
}
