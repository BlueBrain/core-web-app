import * as React from 'react';
import { Button, Empty, Select } from 'antd';
import { LineChartOutlined } from '@ant-design/icons';

import { RemoteData } from '@/types/observatory/index';

const { Option } = Select;

export type ImageCollection = Map<string, ImageItem>;

export type ImageItem = {
  stimulusType: string;
  repetitions: {
    [rep: number]: {
      imageSrc: string;
      fileName: string;
      about?: string;
    }[];
  };
};
interface ImageSetComponentProps {
  stimulusType: string;
  repetitions: {
    [rep: number]: {
      imageSrc: string;
      fileName: string;
      about?: string | undefined;
    }[];
  };
  onRepetitionClicked: (stimulusType: string, rep: string) => () => void;
  imagePreview: React.FC<{ imageUrl: string }>;
}

interface ImageViewComponentProps {
  stimulusTypeMap: Map<string, number>;
  stimulusType: string;
  imageCollectionData: RemoteData<ImageCollection>;
  imagePreview: React.FC<{ imageUrl: string }>;
  onStimulusChange: (value: string) => void;
  onRepetitionClicked: (stimulusType: string, rep: string) => () => void;
}

function ImageSetComponent({
  stimulusType,
  repetitions,
  onRepetitionClicked,
  imagePreview,
}: ImageSetComponentProps) {
  return (
    <div className="stimuli-list" key={`image-preview-${stimulusType}`}>
      <div className="trace-repetitions">
        {Object.keys(repetitions).map((repKey) => {
          const sweeps = repetitions[Number(repKey)]?.sort((a: any, b: any) => {
            const aType = (a.about || a.fileName).toLowerCase().includes('response');

            const bType = (b.about || b.fileName).toLowerCase().includes('response');

            if (aType && !bType) {
              return 1;
            }

            if (bType && !aType) {
              return -1;
            }

            return 0;
          });
          return (
            <div className="repetition-list" key={`image-preview-${stimulusType}-${repKey}`}>
              <div className="mb-1em">
                <h4 className="repetition-label">Repetition {repKey}</h4>
                {/* TODO: unhide button and fix styles for interactive mode */}
                <Button
                  className="interactive-view-btn hidden"
                  size="small"
                  icon={<LineChartOutlined />}
                  onClick={onRepetitionClicked(stimulusType, repKey)}
                >
                  <span className="repetition-label"> Repetition {repKey}</span>
                  <span className="generic-label"> Interactive View</span>
                </Button>
              </div>
              {sweeps.map((imgData: any, index: any) => (
                <div
                  className="mb-1em trace-image-preview"
                  key={`image-preview-${stimulusType}-${repKey}-${imgData.imageSrc}`}
                >
                  <h5 className="trace-type-label">{index === 0 ? 'Stimulus' : 'Recording'}</h5>
                  {imagePreview({ imageUrl: imgData.imageSrc })}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ImageViewComponent({
  stimulusTypeMap,
  stimulusType,
  imageCollectionData,
  imagePreview,
  onStimulusChange,
  onRepetitionClicked,
}: ImageViewComponentProps) {
  const sortedImageCollectionData = React.useMemo(() => {
    const entries = Array.from(imageCollectionData.data?.entries() || []);

    return entries.sort(([stimulusTypeA], [stimulusTypeB]) => {
      const textA = stimulusTypeA.toUpperCase();
      const textB = stimulusTypeB.toUpperCase();
      const AvB = textA > textB ? 1 : 0;
      return textA < textB ? -1 : AvB;
    });
  }, [imageCollectionData]);

  return (
    <div>
      {stimulusTypeMap.size > 1 && (
        <div className="mb-1em">
          Select Stimulus ({stimulusTypeMap.size} available)
          <br />
          <Select
            className="stimulus-select"
            placeholder="Select a stimulus"
            value={stimulusType}
            onChange={onStimulusChange}
          >
            <Option value="All">All</Option>
            {Array.from(stimulusTypeMap.entries()).map(([key, amount]) => (
              <Option value={key} key={key}>
                {key} {amount > 1 && `(${amount})`}
              </Option>
            ))}
          </Select>
        </div>
      )}
      <div>
        <div>
          {sortedImageCollectionData.map(([itemStimulusType, { repetitions }]) => (
            <ImageSetComponent
              key={itemStimulusType}
              stimulusType={itemStimulusType}
              repetitions={repetitions}
              onRepetitionClicked={onRepetitionClicked}
              imagePreview={imagePreview}
            />
          ))}
          {imageCollectionData.data?.size === 0 && (
            <Empty className="p-2em" description="There is no data to show" />
          )}
          {imageCollectionData.data?.size !== 0 && imageCollectionData.loading && (
            <Empty className="p-2em" description="Fetching new stimulus types" />
          )}
          {imageCollectionData.error && (
            <Empty
              className="p-2em"
              description={`There was a problem loading the required resources: ${imageCollectionData.error.message}`}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageViewComponent;
