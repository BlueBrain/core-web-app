import { PrimitiveAtom, useAtomValue } from 'jotai';

import { ExpDesignerParam } from '@/types/experiment-designer';
import SimulationPreview from '@/components/experiment-designer/simulation-preview';

type Props = {
  focusedAtom: PrimitiveAtom<ExpDesignerParam[]>;
};

//

export default function Visualization({ focusedAtom }: Props) {
  // TODO: consume this data by VizTeam
  /* eslint-disable-next-line */
  const data = useAtomValue(focusedAtom);

  return (
    <div className="bg-black flex flex-col justify-center items-center h-full">
      <SimulationPreview />
    </div>
  );
}
