import { ReactNode } from 'react';
import { useAtomValue } from 'jotai';
import CustomTabs from './CustomTabs';
import DefaultListView from '@/components/explore-section/ExploreSectionListingView/DefaultListView';
import { RenderButtonProps } from '@/components/explore-section/ExploreSectionListingView/WithRowSelection';
import { inferredResourcesAtom } from '@/state/explore-section/generalization';
import { InferredResource } from '@/types/explore-section/kg-inference';

export default function DefaultListViewTabs({
  enableDownload,
  title,
  experimentTypeName,
  renderButton,
}: {
  enableDownload?: boolean;
  title: string;
  experimentTypeName: string;
  renderButton?: (props: RenderButtonProps) => ReactNode;
}) {
  const inferredResources = useAtomValue(inferredResourcesAtom(experimentTypeName));

  const items = [
    {
      key: experimentTypeName,
      label: 'Original',
      children: (
        <DefaultListView
          enableDownload={enableDownload}
          experimentTypeName={experimentTypeName}
          title={title}
        />
      ),
    },
    ...Array.from(inferredResources).map((inferredResource: InferredResource) => ({
      key: inferredResource.id,
      label: inferredResource.name,
      children: (
        <DefaultListView
          enableDownload={enableDownload}
          experimentTypeName={experimentTypeName}
          resourceId={inferredResource.id}
          title={title}
          renderButton={renderButton}
        />
      ),
    })),
  ];

  return (
    <div className="p-0 m-0">
      <CustomTabs items={items} experimentTypeName={experimentTypeName} />
    </div>
  );
}
