import { ErrorBoundary } from 'react-error-boundary';

import SimpleErrorComponent from '@/components/GenericErrorFallback';
import SideMenu from '@/components/SideMenu';
import { Content, Label, LinkItemKey, Role } from '@/constants/virtual-labs/sidemenu';
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
            key: LinkItemKey.Build,
            href: `${labProjectUrl}/build`,
            content: Content.Build,
            role: Role.Section,
            styles: 'rounded-full bg-primary-5 py-3 text-primary-9 w-2/3',
          },
        ]}
        lab={{
          key: LinkItemKey.VirtualLab,
          id: params.virtualLabId,
          label: Label.VirtualLab,
          href: `${labUrl}/overview`,
        }}
        project={{
          key: LinkItemKey.Project,
          id: params.projectId,
          virtualLabId: params.virtualLabId,
          label: Label.Project,
          href: `${labProjectUrl}/home`,
        }}
      />
    </ErrorBoundary>
  );
}
