import { ReactNode } from 'react';
import { useAtomValue } from 'jotai';
import CustomTabs from './CustomTabs';
import DefaultListView from '@/components/explore-section/ExploreSectionListingView/DefaultListView';
import { RenderButtonProps } from '@/components/explore-section/ExploreSectionListingView/WithRowSelection';
import { inferredResourceIdsAtom } from '@/state/explore-section/generalization';

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
  const inferredResourceIds = useAtomValue(inferredResourceIdsAtom(experimentTypeName));

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
    ...Array.from(inferredResourceIds).map((v1) => ({
      key: v1 as string,
      label: v1 as string,
      children: (
        <DefaultListView
          enableDownload={enableDownload}
          experimentTypeName={experimentTypeName}
          resourceId={v1 as string}
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
