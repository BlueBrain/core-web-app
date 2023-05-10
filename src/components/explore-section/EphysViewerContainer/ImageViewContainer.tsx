import * as React from 'react';
import { Button, Spin } from 'antd';
import { NexusImage } from './NexusImage';
import ImageViewComponent, { ImageItem } from './ImageViewComponent';
import { DeltaResource } from '@/types/explore-section';
import {
  EPhysImageItem,
  useImageCollectionDistribution,
} from '@/components/explore-section/EphysViewerContainer/hooks/useImageCollectionDistribution';

// Only fetch three traces at a time.
const PAGINATION_OFFSET = 5;

const getStimulusTypeString = (image: EPhysImageItem) => {
  const typeString = image.stimulusType['@id'].split('/');
  return typeString[typeString.length - 1];
};

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

  const imageFilterPredicate = React.useMemo(
    () => (image: EPhysImageItem) => {
      const typeString = getStimulusTypeString(image);
      // Pagination logic. When stimulusType is All, filter out types that does not belong to the page.
      // All stimulusTypes before the current page will already be in the imageCollection (useImageCollectionDistribution).
      // All stimulusTypes after the current page will be excluded and will not be fetched now.
      if (stimulusType === 'All') {
        const allStimulus = Array.from(stimulusTypeMap.keys());
        const pagedTypes = allStimulus.slice(
          page * PAGINATION_OFFSET,
          page * PAGINATION_OFFSET + PAGINATION_OFFSET
        );
        return pagedTypes.includes(typeString);
      }

      return stimulusType === typeString;
    },
    [stimulusType, page, stimulusTypeMap]
  );

  const resultsFilterPredicate = React.useMemo(
    () => (imageItem: ImageItem) => {
      if (stimulusType === 'All') {
        return true;
      }
      return imageItem.stimulusType === stimulusType;
    },
    [stimulusType]
  );

  const imageCollectionData = useImageCollectionDistribution(resource, {
    imageFilterPredicate,
    resultsFilterPredicate,
  });

  const isLastPage = React.useMemo(() => {
    if (stimulusType !== 'All') {
      return true;
    }
    if (imageCollectionData.data) {
      const totalStimulus = Array.from(stimulusTypeMap.keys()).length;
      return totalStimulus - page * PAGINATION_OFFSET - PAGINATION_OFFSET <= 0;
    }
    return false;
  }, [page, stimulusType, stimulusTypeMap, imageCollectionData]);

  const [projectLabel, orgLabel] = resource._project.split('/').reverse();

  return (
    <>
      <ImageViewComponent
        {...{
          stimulusTypeMap,
          stimulusType,
          imageCollectionData,
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
      {isLastPage ? null : (
        <Spin spinning={imageCollectionData.loading}>
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
