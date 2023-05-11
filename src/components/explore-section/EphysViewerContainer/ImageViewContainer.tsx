import * as React from 'react';
import { Button, Spin } from 'antd';
import { useMemo } from 'react';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';
import { NexusImage } from './NexusImage';
import ImageViewComponent from './ImageViewComponent';
import { DeltaResource } from '@/types/explore-section';
import createImageCollectionDataAtom from '@/components/explore-section/EphysViewerContainer/state/ImageCollectionDataAtom';

// Only fetch three traces at a time.
const PAGINATION_OFFSET = 5;

interface ImageViewContainerProps {
  resource: DeltaResource;
  stimulusTypeMap: Map<string, number>;
  stimulusType: string;
  onStimulusChange: (value: string) => void;
  onRepetitionClicked: (stimulusType: string, rep: string) => () => void;
}

function ImageViewContainer({
  stimulusType,
  resource,
  stimulusTypeMap,
  onRepetitionClicked,
  onStimulusChange,
}: ImageViewContainerProps) {
  const [page, setPage] = React.useState<number>(0);
  const imageCollectionAtom = useMemo(
    () => loadable(createImageCollectionDataAtom(resource, page, stimulusType, stimulusTypeMap)),
    [page, resource, stimulusType, stimulusTypeMap]
  );
  const imageCollectionData = useAtomValue(imageCollectionAtom);

  const isLastPage = React.useMemo(() => {
    if (stimulusType !== 'All') {
      return true;
    }
    if (imageCollectionData.state === 'hasData' && imageCollectionData.data) {
      const totalStimulus = Array.from(stimulusTypeMap.keys()).length;
      return totalStimulus - page * PAGINATION_OFFSET - PAGINATION_OFFSET <= 0;
    }
    return false;
  }, [page, stimulusType, stimulusTypeMap, imageCollectionData]);

  const [projectLabel, orgLabel] = resource._project.split('/').reverse();

  return (
    <>
      {imageCollectionData.state === 'hasData' && imageCollectionData.data && (
        <ImageViewComponent
          {...{
            stimulusTypeMap,
            stimulusType,
            imageCollectionData: imageCollectionData.data,
            onStimulusChange,
            onRepetitionClicked,
            // eslint-disable-next-line react/no-unstable-nested-components
            imagePreview: ({ imageUrl }) => (
              // We need to put this as a prop because it contains effects (container, not component)
              <NexusImage
                {...{
                  imageUrl,
                  org: orgLabel,
                  project: projectLabel,
                }}
              />
            ),
          }}
        />
      )}

      {!isLastPage && (
        <Spin spinning={imageCollectionData.state === 'loading'}>
          <Button
            onClick={() => {
              setPage(page + 1);
            }}
          >
            Load More
          </Button>
        </Spin>
      )}
    </>
  );
}

export default ImageViewContainer;
