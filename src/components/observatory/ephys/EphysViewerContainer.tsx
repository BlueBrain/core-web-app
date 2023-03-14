import { NexusClient } from '@bbp/nexus-sdk';
import React from 'react';
import { EphysDeltaResource } from '@/types/observatory';

import { EPhysImageItem } from '@/components/observatory/ephys/useImageCollectionDistribution';
import { propAsArray } from '@/util/observatory/nexus-tools';
import ImageViewContainer from '@/components/observatory/ephys/ImageViewContainer';
import GraphViewContainer from '@/components/observatory/ephys/GraphViewContainer';

import './ephys-plugin-styles.scss';

enum VIEWS {
  IMAGE = 'image',
  CHART = 'graph',
}

const getStimulusTypeString = (image: EPhysImageItem) => {
  const typeString = image.stimulusType['@id'].split('/');
  return typeString[typeString.length - 1];
};

function EphysViewerContainer({
  resource,
  nexus,
}: {
  resource: EphysDeltaResource;
  nexus: NexusClient;
}) {
  const [view, setView] = React.useState<VIEWS>(VIEWS.IMAGE);
  const [selectedRepetition, setSelectedRepetition] = React.useState<string>();
  const stimulusTypes = resource.image
    ? propAsArray<EPhysImageItem>(resource, 'image')
        .filter((image) => image.about.match(/stimulation/i))
        .map(getStimulusTypeString)
        .sort()
    : [];

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
  }, [resource, stimulusTypes]);

  const [stimulusType, setStimulusType] = React.useState<string>('All');

  const handleChange = (value: string) => {
    setStimulusType(value);
  };

  const handleRepetitionClicked = (domStimulusType: string, repetition: string) => () => {
    setStimulusType(domStimulusType);
    setSelectedRepetition(repetition);
    setView(VIEWS.CHART);
  };

  return (
    <div className="ephys-container">
      <div>
        {view === VIEWS.IMAGE && (
          <ImageViewContainer
            {...{
              stimulusType,
              resource,
              nexus,
              stimulusTypeMap,
              onRepetitionClicked: handleRepetitionClicked,
              onStimulusChange: handleChange,
            }}
          />
        )}
        {view === VIEWS.CHART && (
          <GraphViewContainer
            nexus={nexus}
            resource={resource}
            defaultStimulusType={
              stimulusType === 'None' || stimulusType === 'All' ? undefined : stimulusType
            }
            defaultRepetition={selectedRepetition}
          />
        )}
      </div>
    </div>
  );
}

export default EphysViewerContainer;
