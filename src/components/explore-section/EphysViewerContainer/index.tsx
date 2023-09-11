import { Radio, RadioChangeEvent } from 'antd';
import { FileImageOutlined, LineChartOutlined } from '@ant-design/icons';
import React, { useMemo } from 'react';
import { EPhysImageItem } from '@/types/explore-section/resources';
import { ExperimentalTrace } from '@/types/explore-section/delta';
import { ensureArray } from '@/util/nexus';
import ImageViewContainer from '@/components/explore-section/EphysViewerContainer/ImageViewContainer';
import GraphViewContainer from '@/components/explore-section/EphysViewerContainer/GraphViewContainer';
import './styles/ephys-plugin-styles.scss';

enum VIEWS {
  IMAGE = 'image',
  CHART = 'graph',
}

const getStimulusTypeString = (image: EPhysImageItem) => {
  const typeString = image.stimulusType['@id'].split('/');
  return typeString[typeString.length - 1];
};

function EphysViewerContainer({ resource }: { resource: ExperimentalTrace }) {
  const [view, setView] = React.useState<VIEWS>(VIEWS.IMAGE);
  const [selectedRepetition, setSelectedRepetition] = React.useState<string>();
  const stimulusTypes = useMemo(
    () =>
      resource.image
        ? ensureArray(resource.image)
            .filter((image) => image.about.match(/stimulation/i))
            .map(getStimulusTypeString)
            .sort()
        : [],
    [resource]
  );

  const stimulusTypeMap = React.useMemo(() => {
    const typeToNumbers = new Map<string, number>();

    stimulusTypes.forEach((stimulusTypeName) => {
      const amount = typeToNumbers.get(stimulusTypeName);
      if (amount) {
        typeToNumbers.set(stimulusTypeName, amount + 1);
      } else {
        typeToNumbers.set(stimulusTypeName, 1);
      }
    });

    return typeToNumbers;
  }, [stimulusTypes]);

  const [stimulusType, setStimulusType] = React.useState<string>('All');

  const handleViewChange = (e: RadioChangeEvent) => {
    setView(e.target.value);
  };

  const handleChange = (value: string) => {
    setStimulusType(value);
  };

  const handleRepetitionClicked = (domStimulusType: string, repetition: string) => () => {
    setStimulusType(domStimulusType);
    setSelectedRepetition(repetition);
    setView(VIEWS.CHART);
  };

  return (
    <div className="flex flex-col gap-6">
      <Radio.Group onChange={handleViewChange} value={view}>
        <Radio.Button value={VIEWS.IMAGE}>
          <FileImageOutlined /> Overview
        </Radio.Button>
        <Radio.Button value={VIEWS.CHART}>
          <LineChartOutlined /> Interactive Details
        </Radio.Button>
      </Radio.Group>
      {view === VIEWS.IMAGE && (
        <ImageViewContainer
          {...{
            stimulusType,
            resource,
            stimulusTypeMap,
            onRepetitionClicked: handleRepetitionClicked,
            onStimulusChange: handleChange,
          }}
        />
      )}
      {view === VIEWS.CHART && (
        <GraphViewContainer
          resource={resource}
          defaultStimulusType={
            stimulusType === 'None' || stimulusType === 'All' ? undefined : stimulusType
          }
          defaultRepetition={selectedRepetition}
        />
      )}
    </div>
  );
}

export default EphysViewerContainer;
