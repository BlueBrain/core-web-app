import { useAtom } from 'jotai';
import sortBy from 'lodash/sortBy';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { getFocusedAtom } from '@/components/experiment-designer/utils';
import { nodeSetsPaletteAtom } from '@/components/experiment-designer/simulation-preview/atoms';
import { TargetList } from '@/types/experiment-designer';

const setupAtom = getFocusedAtom('setup');

interface LegendItem {
  label: string;
  colorHex: string;
}

interface LegendItemBoxProps {
  label: string;
  colorHex: string;
  onColorChange(newColor: string): void;
}

interface ColorLegendProps {
  targetsToDisplay: TargetList;
}

function LegendItemBox({ label, colorHex, onColorChange }: LegendItemBoxProps) {
  const handleColorChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onColorChange(event.target.value);
    },
    [onColorChange]
  );

  return (
    <div key={label} className="flex flex-row items-center gap-2">
      <div className="w-[10px] h-[10px] relative">
        <div
          className="w-[10px] h-[10px] rounded-full p-0 border-0 absolute left-0 top-0"
          style={{ backgroundColor: colorHex }}
        />
        <input
          type="color"
          onChange={handleColorChange}
          className="absolute left-0 top-0 opacity-0"
          value={colorHex}
        />
      </div>
      {label}
    </div>
  );
}

export default function ColorLegend({ targetsToDisplay }: ColorLegendProps) {
  const [setup] = useAtom(setupAtom);
  const [palette, setPalette] = useAtom(nodeSetsPaletteAtom);
  const [legendItems, setLegendItems] = useState<LegendItem[]>([]);

  const handleColorChange = useCallback(
    (label: string, newColor: string) => {
      setPalette((prev) => ({ ...prev, [label]: newColor }));
    },
    [setPalette]
  );

  useEffect(() => {
    const newLegendItems = sortBy(
      targetsToDisplay.map((targetName) => ({
        label: targetName,
        colorHex: palette[targetName],
      })),
      'label'
    );
    setLegendItems(newLegendItems);
  }, [targetsToDisplay, palette, setup]);

  return legendItems.length ? (
    <div className="flex flex-col gap-2 text-white">
      {legendItems.map(({ label, colorHex }) =>
        colorHex ? (
          <LegendItemBox
            key={label}
            label={label}
            colorHex={colorHex}
            onColorChange={(color) => handleColorChange(label, color)}
          />
        ) : null
      )}
    </div>
  ) : null;
}
