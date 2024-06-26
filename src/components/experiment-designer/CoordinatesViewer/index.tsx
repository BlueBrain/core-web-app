import { PrimitiveAtom, useAtomValue } from 'jotai';

import { ExpDesignerPositionParameter } from '@/types/experiment-designer';
import { classNames } from '@/util/utils';

type Props = {
  paramAtom: PrimitiveAtom<ExpDesignerPositionParameter>;
  className?: string;
};

const coordinateStyle = 'text-gray-400 mx-2';

export default function CoordinatesViewer({ paramAtom, className }: Props) {
  const data = useAtomValue(paramAtom);
  if (data.hidden) return null;

  return (
    <div className={classNames('flex gap-3', className)}>
      <div className="grow font-bold">{data.name}</div>
      <div>
        <span className={coordinateStyle}>X</span>
        <span>{Math.round(data.value[0])}</span>
        <span className={coordinateStyle}>Y</span>
        <span>{Math.round(data.value[1])}</span>
        <span className={coordinateStyle}>Z</span>
        <span>{Math.round(data.value[2])}</span>
      </div>
    </div>
  );
}
