import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';

import NumberInput from '@/components/experiment-interactive/ExperimentInteractive/NumberInput';
import {
  movieGenerationTimeRangeAtom,
  simulationDurationAtom,
} from '@/state/experiment-interactive';

export default function SimulationRangeInputs() {
  const simulationDuration = useAtomValue(simulationDurationAtom);

  const [movieGenerationTimeRange, setMovieGenerationTimeRange] = useAtom(
    movieGenerationTimeRangeAtom
  );

  useEffect(() => {
    if (movieGenerationTimeRange.start > movieGenerationTimeRange.end) {
      setMovieGenerationTimeRange((prev) => ({ start: prev.end, end: prev.start }));
    }
  }, [movieGenerationTimeRange.end, movieGenerationTimeRange.start, setMovieGenerationTimeRange]);

  return (
    <div className="flex flex-row gap-5 text-sm font-semibold p-2">
      <div className="flex flex-row gap-2">
        Start{' '}
        <NumberInput
          value={movieGenerationTimeRange.start}
          min={0}
          step={1}
          size={4}
          unit="ms"
          onChange={(value) =>
            setMovieGenerationTimeRange((prev) => ({
              ...prev,
              start: value,
            }))
          }
        />
      </div>
      <div className="flex flex-row gap-2">
        End
        <NumberInput
          value={movieGenerationTimeRange.end}
          min={1}
          max={simulationDuration}
          step={1}
          size={6}
          unit="ms"
          onChange={(value) =>
            setMovieGenerationTimeRange((prev) => ({
              ...prev,
              end: value,
            }))
          }
        />
      </div>
    </div>
  );
}
