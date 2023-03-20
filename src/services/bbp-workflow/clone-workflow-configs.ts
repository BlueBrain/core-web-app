import { Session } from 'next-auth';
import { workflowMetaConfigs } from '@/services/bbp-workflow/config';

import { cloneWorkflowConfigResource } from '@/api/nexus';

async function cloneWorkflowMetaConfigsAndReplace(contentStr: string, session: Session) {
  let replacedTemplate = contentStr;

  const clonedCfgsPromises = Object.entries(workflowMetaConfigs).map(
    async ([, { templateUrl, placeholder }]) => {
      const newResource = await cloneWorkflowConfigResource(templateUrl, session);
      const urlWithRev = `${newResource._self}?rev=${newResource._rev}`;
      replacedTemplate = replacedTemplate.replace(placeholder, urlWithRev);
    }
  );

  await Promise.all(clonedCfgsPromises);
  return replacedTemplate;
}

export default cloneWorkflowMetaConfigsAndReplace;
