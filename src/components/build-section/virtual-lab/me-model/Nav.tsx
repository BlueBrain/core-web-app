import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import SideMenu from '@/components/SideMenu';
import { Label, LinkItemKey } from '@/constants/virtual-labs/sidemenu';
import { generateLabUrl } from '@/util/virtual-lab/urls';

export default function Nav() {
  // TODO: get this params from state
  const params = { virtualLabId: 'TODO', projectId: 'TODO' };
  const labUrl = generateLabUrl(params.virtualLabId);

  const labProjectUrl = `${labUrl}/project/${params.projectId}`;

  return (
    <ErrorBoundary FallbackComponent={SimpleErrorComponent}>
      <SideMenu
        links={[
          {
            key: LinkItemKey.Project,
            label: Label.Project,
            href: `${labProjectUrl}/home`,
            content: params.projectId,
          },
        ]}
        lab={{
          key: LinkItemKey.VirtualLab,
          id: params.virtualLabId,
          label: Label.VirtualLab,
          href: `${labUrl}/lab`,
          content: params.virtualLabId,
        }}
      />
    </ErrorBoundary>
  );
}
