import { ReactNode, useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { Tabs } from 'antd';
import DefaultListView from './DefaultListView';
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

  // Convert inferredResourceIds to an array
  const inferredResourceIdsArray = Array.from(inferredResourceIds);

  // Use state to manage the items array
  const [items, setItems] = useState<Array<{ label: string; key: string; children: ReactNode }>>([
    {
      key: experimentTypeName,
      label: 'Original',
      children: (
        <DefaultListView
          enableDownload={enableDownload}
          title={title}
          experimentTypeName={experimentTypeName}
          renderButton={renderButton}
        />
      ),
    },
  ]);

  useEffect(() => {
    // Create a new array with the original item and additional items
    const newItems = [
      {
        key: experimentTypeName,
        label: 'Original',
        children: (
          <DefaultListView
            enableDownload={enableDownload}
            title={title}
            experimentTypeName={experimentTypeName}
            renderButton={renderButton}
          />
        ),
      },
      ...inferredResourceIdsArray.map((v1) => ({
        key: v1 as string,
        label: v1 as string,
        children: (
          <DefaultListView
            enableDownload={enableDownload}
            title={title}
            experimentTypeName={experimentTypeName}
            resourceId={v1 as string}
            renderButton={renderButton}
          />
        ),
      })),
    ];

    // Update the items array
    setItems(newItems);
  }, [inferredResourceIdsArray, experimentTypeName, title, enableDownload, renderButton]);

  return (
    <div className="p-0 m-0">
      <Tabs items={items} />
    </div>
  );
}
