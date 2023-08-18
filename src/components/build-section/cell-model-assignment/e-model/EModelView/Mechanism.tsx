import { useAtomValue } from 'jotai';

import { eModelSubCellularModelScriptAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';

export default function Mechanism() {
  const mechanismDescriptions = useAtomValue(eModelSubCellularModelScriptAtom);
  const hasData = mechanismDescriptions?.length ? mechanismDescriptions : null;

  return (
    <div className="text-primary-8">
      {hasData &&
        mechanismDescriptions?.map(({ name }) => (
          <div key={name}>
            <span className="text-2xl font-bold">Mechanism</span>
            <span className="ml-4">{name}</span>
            <div className="border-2 w-[170px] p-4 mt-4 flex gap-4">
              {name}
              <input type="radio" />
            </div>
          </div>
        ))}
    </div>
  );
}
