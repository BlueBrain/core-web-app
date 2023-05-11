import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { getFocusedAtom } from '@/components/experiment-designer/utils';
import getSimulatedNeurons from '@/components/experiment-designer/simulation-preview/get-simulated-neurons';
import { nodeSetsPaletteAtom } from '@/components/experiment-designer/simulation-preview/atoms';

const setupAtom = getFocusedAtom('setup');

interface LegendItem {
  label: string;
  colorHex: string;
}

interface LegendItemBoxProps {
  label: string;
  colorHex: string;
}

function LegendItemBox({ label, colorHex }: LegendItemBoxProps) {
  return (
    <div key={label} className="flex flex-row gap-2">
      <div className="w-[20px]" style={{ backgroundColor: colorHex }} />
      {label}
    </div>
  );
}

export default function ColorLegend() {
  const [setup] = useAtom(setupAtom);
  const [palette] = useAtom(nodeSetsPaletteAtom);
  const [legendItems, setLegendItems] = useState<LegendItem[]>([]);

  useEffect(() => {
    const nodeSets = getSimulatedNeurons(setup);
    setLegendItems(
      nodeSets.map((nodeSetName) => ({
        label: nodeSetName,
        colorHex: palette[nodeSetName],
      }))
    );
  }, [palette, setup]);

  return legendItems.length ? (
    <div className="flex flex-col gap-2">
      <div className="opacity-50">Simulated Neurons:</div>
      {legendItems.map(({ label, colorHex }) => (
        <LegendItemBox key={label} label={label} colorHex={colorHex} />
      ))}
    </div>
  ) : null;
}
