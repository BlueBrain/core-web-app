import Image from 'next/image';
import { PrimitiveAtom, useAtomValue } from 'jotai';

import { basePath } from '@/config';
import { ExpDesignerParam } from '@/types/experiment-designer';

type Props = {
  focusedAtom: PrimitiveAtom<ExpDesignerParam[]>;
};

export default function Visualization({ focusedAtom }: Props) {
  // TODO: consume this data by VizTeam
  /* eslint-disable-next-line */
  const data = useAtomValue(focusedAtom);

  return (
    <div className="bg-black flex flex-col justify-center items-center h-full">
      <Image
        className="mv-1"
        src={`${basePath}/images/experiment-designer-viz-placeholder.png`}
        alt="Experiment designer viz placeholder image"
        width={400}
        height={400}
      />
    </div>
  );
}
