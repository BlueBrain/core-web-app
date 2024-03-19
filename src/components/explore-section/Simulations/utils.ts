import { useEffect, useState } from 'react';
import { Session } from 'next-auth';
import JSZip from 'jszip';
import { Analysis } from '@/app/explore/(content)/simulation-campaigns/shared';
import { to64 } from '@/util/common';
import {
  createWorkflowConfigResource,
  fetchFileByUrl,
  fetchResourceById,
  fetchResourceByUrl,
} from '@/api/nexus';
import { composeUrl } from '@/util/nexus';
import {
  SimulationCampaign,
  SimulationCampaignExecution,
} from '@/types/explore-section/delta-simulation-campaigns';
import { BbpWorkflowConfigResource, WorkflowExecution } from '@/types/nexus';
import { useSessionAtomValue } from '@/hooks/hooks';

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
      "command": "${a.command}",
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

/*
  Fetches the WorkflowExecuton from the sim campaign
*/
export async function fetchSimCampWorkflowConfig(
  simCampaign: SimulationCampaign,
  session: Session | null
) {
  if (!simCampaign.wasGeneratedBy || !session) return;

  const simCampaignExecution = await fetchResourceById<SimulationCampaignExecution>(
    simCampaign.wasGeneratedBy['@id'],
    session
  );

  const workflowExecution = await fetchResourceById<WorkflowExecution>(
    simCampaignExecution.wasInfluencedBy['@id'],
    session
  );

  const workflowConfig = await fetchFileByUrl(workflowExecution.distribution.contentUrl, session);
  const configPayload = await workflowConfig.blob();
  const jszip = new JSZip();
  const zip = await jszip.loadAsync(configPayload);
  return await zip.file('simulation.cfg')?.async('string');
}

/*
  Gets the url for the MultiAnalyseSimCampaignMeta bbp-workflow config
*/
function extractMultiAnalysisConfigUrl(file: string) {
  // Regex to find the URL
  const regex = /\[MultiAnalyseSimCampaignMeta\]\s*config-url:\s*(.+)/;

  const match = regex.exec(file);

  if (match && match[1]) {
    return match[1].replace(/%%/g, '%');
  }
}

/*
  Fetches the MultiAnalyseSimCampaignMeta config entity
*/
async function fetchMultAnalyseConfig(url: string, session: Session) {
  const resource = await fetchResourceByUrl<BbpWorkflowConfigResource>(url, session);
  const file = resource && (await fetchFileByUrl(resource.distribution.contentUrl, session));
  return file && (await file.text());
}

type AnalysisConfig = {
  AnalyseSimCampaign: {
    source_code_url: string;
  };
};

/*
  Gets all the custom analysis configurations 
  (configured during sim campaign configuration in the 'custom analysis' section)
*/
function extractAnalysisConfigs(config: string): AnalysisConfig[] | undefined {
  // Regex to find everything after 'analysis-configs:'
  const regex = /analysis-configs:\s*([\s\S]+)/;

  const match = regex.exec(config);

  if (match && match[1]) {
    return JSON.parse(match[1]);
  }
}

/* 
  Gets the ids of all the launched custom analysis
*/
export function useAnalysisIds(resource: SimulationCampaign): [string[], boolean] {
  const session = useSessionAtomValue();
  const [customAnalysisIds, setCustomAnalysisIds] = useState<string[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    async function getConfigs() {
      if (!session) return;

      const workflowConfig = await fetchSimCampWorkflowConfig(resource, session);

      const multiAnalysisConfigUrl =
        workflowConfig && extractMultiAnalysisConfigUrl(workflowConfig);

      const multiAnalysisConfig =
        multiAnalysisConfigUrl && (await fetchMultAnalyseConfig(multiAnalysisConfigUrl, session));

      const fetchedConfigs = multiAnalysisConfig
        ? extractAnalysisConfigs(multiAnalysisConfig)
        : undefined;

      const ids = fetchedConfigs?.map((c: AnalysisConfig) => c.AnalyseSimCampaign.source_code_url);
      setCustomAnalysisIds(ids ?? []);
      setFetching(false);
    }

    getConfigs();
  }, [resource, session]);

  return [customAnalysisIds, fetching];
}
