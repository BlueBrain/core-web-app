import * as React from 'react';
import { Select } from 'antd';

import DistinctColors from 'distinct-colors';
import StimulusPlot from './StimulusPlot';
import ResponsePlot from './ResponsePlot';
import OptionSelect from '@/components/observatory/ephys/OptionSelect';
import TraceSelectorGroup from '@/components/observatory/ephys/TraceSelectorGroup';
import {
  ZoomRanges,
  DataSets,
  Repetition,
  IndexDataValue,
  RABIndex,
} from '@/types/observatory/index';

interface EphysPlotProps {
  options: DataSets;
  index: RABIndex;
  defaultStimulusType?: string;
  defaultRepetition?: string;
}
function EphysPlot({ options, index, defaultStimulusType, defaultRepetition }: EphysPlotProps) {
  const [zoomRanges, setZoomRanges] = React.useState<ZoomRanges | null>(null);

  const [selectedDataSet, setSelectedDataSet] = React.useState<string>(
    defaultStimulusType || Object.keys(index.data)[0]
  );

  const [selectedRepetition, setSelectedRepetition] = React.useState<string>(
    defaultRepetition || Object.keys(index.data[selectedDataSet].repetitions)[0]
  );

  const [selectedSweeps, setSelectedSweeps] = React.useState<string[]>([]);

  const [previewItem, setPreviewItem] = React.useState<string>();
  const repetitions: Repetition = React.useMemo(
    () => (index.data[selectedDataSet] ? index.data[selectedDataSet].repetitions : {}),
    [selectedDataSet, index]
  );

  const { sweeps, colorMapper } = React.useMemo(() => {
    const selectedData = index.data[selectedDataSet];
    if (selectedData && selectedData.repetitions && selectedData.repetitions[selectedRepetition]) {
      const rawData = repetitions[selectedRepetition].sweeps;
      const colors = DistinctColors({ count: rawData.length });
      const mappedColor: { [key: string]: string } = rawData.reduce(
        (mapper: object, sweep: string, colorIndex) => ({
          ...mapper,
          [sweep]: colors[colorIndex].hex(),
        }),
        {}
      );
      return { colorMapper: mappedColor, sweeps: rawData };
    }

    return { sweeps: [], colorMapper: {} };
  }, [repetitions, selectedDataSet, selectedRepetition, index]);

  const selectedMetadata: IndexDataValue | undefined = React.useMemo(
    () => index.data[selectedDataSet],
    [selectedDataSet, index]
  );

  const dataSetOptions = Object.keys(index.data).map((stimulusTypeKey) => {
    const repetitionNum = Object.keys(index.data[stimulusTypeKey].repetitions).length;

    return (
      <Select.Option key={stimulusTypeKey} value={stimulusTypeKey}>
        {stimulusTypeKey} {repetitionNum > 1 && `(${repetitionNum})`}
      </Select.Option>
    );
  });

  const repetitionOptions = repetitions
    ? Object.keys(repetitions).map((v) => (
        <Select.Option key={v} value={v}>
          {v}
        </Select.Option>
      ))
    : null;

  const sweepsOptions = sweeps ? sweeps.map((sweep) => ({ label: sweep, value: sweep })) : [];

  const handleStimulusChange = (value: string) => {
    setSelectedDataSet(value);
    setSelectedRepetition(Object.keys(index.data[value].repetitions)[0]);
    setSelectedSweeps([]);
    setZoomRanges(null);
  };

  const handlePreviewSweep = (value?: string) => {
    if (!value) {
      setPreviewItem(undefined);
    } else if (sweepsOptions.length > 1 && !selectedSweeps.includes(value)) {
      setPreviewItem(value);
    }
  };

  const handleRepetitionChange = (value: string) => {
    setSelectedRepetition(value);
    setSelectedSweeps([]);
    setZoomRanges(null);
  };

  const sweepObject = {
    selectedSweeps,
    colorMapper,
    allSweeps: sweeps,
    previewSweep: previewItem,
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-8">
        <OptionSelect
          label={{ title: 'Stimulus', numberOfAvailable: Object.keys(index.data).length }}
          options={dataSetOptions}
          value={selectedDataSet}
          handleChange={handleStimulusChange}
        />
        <OptionSelect
          label={{ title: 'Repetition', numberOfAvailable: Object.keys(repetitions).length }}
          options={repetitionOptions}
          value={selectedRepetition}
          handleChange={handleRepetitionChange}
          hideWhenSingle
        />
        <TraceSelectorGroup
          handlePreviewSweep={handlePreviewSweep}
          colorMapper={colorMapper}
          selectedSweeps={selectedSweeps}
          previewItem={previewItem}
          setSelectedSweeps={setSelectedSweeps}
          sweepsOptions={sweepsOptions}
        />
        {sweeps.length > 1 && (
          <button
            type="button"
            className="h-[32px] bg-transparant self-end text-dark"
            onClick={() => {
              setSelectedSweeps([]);
              setZoomRanges(null);
            }}
          >
            Reset
          </button>
        )}
      </div>
      <div className="flex flex-col 2xl:flex-row gap-10">
        <StimulusPlot
          setSelectedSweeps={setSelectedSweeps}
          metadata={selectedMetadata}
          sweeps={sweepObject}
          dataset={selectedDataSet}
          options={options}
          zoomRanges={zoomRanges}
          onZoom={setZoomRanges}
        />
        <ResponsePlot
          metadata={selectedMetadata}
          sweeps={sweepObject}
          dataset={selectedDataSet}
          setSelectedSweeps={setSelectedSweeps}
          options={options}
          zoomRanges={zoomRanges}
          onZoom={setZoomRanges}
        />
      </div>
    </div>
  );
}

export default EphysPlot;
