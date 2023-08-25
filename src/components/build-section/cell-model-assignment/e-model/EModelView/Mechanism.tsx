import { useAtomValue } from 'jotai';

import { eModelSubCellularModelScriptAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';

export default function Mechanism() {
  const mechanismDescriptions = useAtomValue(eModelSubCellularModelScriptAtom);
  const hasData = mechanismDescriptions?.length ? mechanismDescriptions : null;

  return (
    <div className="text-primary-8">
      <span className="text-2xl font-bold">Mechanisms</span>
      <div className="flex gap-4 flex-wrap">
        {hasData &&
          mechanismDescriptions?.map(({ name }) => (
            <div key={name} className="border-2 w-[120px] p-4 mt-4 flex gap-4">
              {name}
              <input type="radio" checked readOnly />
            </div>
          ))}
      </div>
    </div>
  );
}
