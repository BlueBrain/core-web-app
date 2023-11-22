import { Session } from 'next-auth';
import template from 'lodash/template';

import { CustomAnalysisType } from '@/app/explore/(content)/simulation-campaigns/shared';
import { to64 } from '@/util/common';
import { createWorkflowConfigResource } from '@/api/nexus';
import { composeUrl } from '@/util/nexus';
import { CustomAnalysisPlaceholders, simulationMetaConfigs } from '@/services/bbp-workflow/config';

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

function getEmptyAnalysisConfig() {
  return `[MultiAnalyseSimCampaign]
  workspace-prefix:
  analysis-configs: []
  `;
}

// TODO: Figure out how to handle custom config later
// TODO: Remove temporary git user and password
export function getMultiAnalysisWorkflowConfig(analysis: CustomAnalysisType | null, session: Session) {
  if (!analysis) return getEmptyAnalysisConfig();

  const variables = {
    [CustomAnalysisPlaceholders.USERNAME]: session.user.username,
    [CustomAnalysisPlaceholders.ID]: analysis['@id'],
    [CustomAnalysisPlaceholders.REPO_ID]: analysis.codeRepository['@id'],
    [CustomAnalysisPlaceholders.BRANCH]: analysis.branch,
    [CustomAnalysisPlaceholders.SUBDIRECTORY]: analysis.subdirectory,
  };
  const fileContent = simulationMetaConfigs.CustomAnalysisMeta.templateFile;
  return template(fileContent)(variables);
}

export function getMultiAnalyseSimCampaignMetaConfig(url: string) {
  return `
  
  [MultiAnalyseSimCampaignMeta]
  config-url: ${url}
  `;
}

export async function getConfigWithMultiAnalysis(
  config: string,
  analysis: CustomAnalysisType | null,
  session: Session
) {
  const multiAnalyseSimCampaignMeta = getMultiAnalysisWorkflowConfig(analysis, session);

  const newResource = await createWorkflowConfigResource(
    simulationMetaConfigs.CustomAnalysisMeta.fileName,
    multiAnalyseSimCampaignMeta,
    session
  );

  const urlWithRev = composeUrl('resource', newResource['@id'], {
    rev: newResource._rev,
  }).replaceAll('%', '%%');

  return config.concat(getMultiAnalyseSimCampaignMetaConfig(urlWithRev));
}
