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
    <div className="relative h-[90px] overflow-hidden border border-white/20 p-1">
      <div
        className="absolute h-full w-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${basePath}/images/experiment-interactive/mock.png)` }}
        onClick={handleCheckedChange}
        role="presentation"
      />

      <div className="absolute left-1 top-1 flex flex-row items-center justify-start gap-2 font-bold">
        <Checkbox.Root
          className="h-5 w-5 rounded border border-white bg-transparent"
          checked={isChecked}
          onCheckedChange={handleCheckedChange}
        >
          <Checkbox.Indicator className="flex w-full items-center justify-center">
            <CheckIcon className="check" />
          </Checkbox.Indicator>
        </Checkbox.Root>

        {index}
      </div>
    </div>
  );
}
