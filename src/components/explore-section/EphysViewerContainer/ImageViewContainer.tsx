import { Button, Spin } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { loadable } from 'jotai/utils';
import { useAtomValue } from 'jotai';

import { NexusImage } from './NexusImage';
import ImageViewComponent, { ImageCollection } from './ImageViewComponent';
import { ExperimentalTrace } from '@/types/explore-section/delta-experiment';
import createImageCollectionDataAtom from '@/components/explore-section/EphysViewerContainer/state/ImageCollectionDataAtom';

// Only fetch three traces at a time.
const PAGINATION_OFFSET = 5;

interface ImageViewContainerProps {
  resource: ExperimentalTrace;
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
  const [page, setPage] = useState<number>(0);
  const imageCollectionAtom = useMemo(
    () => loadable(createImageCollectionDataAtom(resource, page, stimulusType, stimulusTypeMap)),
    [page, resource, stimulusType, stimulusTypeMap]
  );
  const imageCollectionData = useAtomValue(imageCollectionAtom);
  const [localImageCollectionData, setLocalImageCollectionData] = useState<ImageCollection>();

  const isLastPage = useMemo(() => {
    if (stimulusType !== 'All') {
      return true;
    }
    if (imageCollectionData.state === 'hasData' && imageCollectionData.data) {
      const totalStimulus = Array.from(stimulusTypeMap.keys()).length;
      return totalStimulus - page * PAGINATION_OFFSET - PAGINATION_OFFSET <= 0;
    }
    return false;
  }, [page, stimulusType, stimulusTypeMap, imageCollectionData]);

  useEffect(() => {
    if (imageCollectionData.state !== 'hasData' || !imageCollectionData.data) return;

    setLocalImageCollectionData(imageCollectionData.data);
  }, [imageCollectionData]);

  const [projectLabel, orgLabel] = resource._project.split('/').reverse();

  return (
    <>
      {localImageCollectionData && (
        <ImageViewComponent
          {...{
            stimulusTypeMap,
            stimulusType,
            imageCollectionData: localImageCollectionData,
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
