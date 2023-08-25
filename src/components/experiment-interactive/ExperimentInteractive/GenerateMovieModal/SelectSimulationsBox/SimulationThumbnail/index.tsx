import { useCallback, useMemo } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { useAtom } from 'jotai';

import { SimulationPreviewElement } from '@/components/experiment-interactive/types';
import { basePath } from '@/config';
import { CheckIcon } from '@/components/icons';
import { movieGenerationSimulationsAtom } from '@/state/experiment-interactive';

interface SimulationThumbnailProps {
  index: number;
  simulationPreview: SimulationPreviewElement;
}

export default function SimulationThumbnail({
  simulationPreview,
  index,
}: SimulationThumbnailProps) {
  const [movieGenerationSimulations, setMovieGenerationSimulations] = useAtom(
    movieGenerationSimulationsAtom
  );

  const { id } = simulationPreview;

  const handleCheckedChange = useCallback(() => {
    setMovieGenerationSimulations((prev) => {
      const value = new Set(prev);
      if (!value.has(id)) {
        value.add(id);
      } else {
        value.delete(id);
      }
      return Array.from(value);
    });
  }, [id, setMovieGenerationSimulations]);

  const isChecked = useMemo(
    () => movieGenerationSimulations.includes(simulationPreview.id),
    [movieGenerationSimulations, simulationPreview.id]
  );

  return (
    <div className="relative overflow-hidden border border-white/20 p-1 h-[90px]">
      <div
        className="bg-cover bg-center bg-no-repeat w-full h-full absolute"
        style={{ backgroundImage: `url(${basePath}/images/experiment-interactive/mock.png)` }}
        onClick={handleCheckedChange}
        role="presentation"
      />

      <div className="absolute left-1 top-1 font-bold flex flex-row gap-2 items-center justify-start">
        <Checkbox.Root
          className="bg-transparent border border-white h-5 w-5 rounded"
          checked={isChecked}
          onCheckedChange={handleCheckedChange}
        >
          <Checkbox.Indicator className="flex items-center justify-center w-full">
            <CheckIcon className="check" />
          </Checkbox.Indicator>
        </Checkbox.Root>

        {index}
      </div>
    </div>
  );
}
