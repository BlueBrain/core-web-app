import { useAtom, useAtomValue } from 'jotai';
import { ChangeEvent, useEffect } from 'react';

import {
  eModelAtom,
  eModelEditModeAtom,
  eModelUIConfigAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import EditPencilIcon from '@/components/icons/EditPencil';

const titleStyle = 'text-3xl font-bold text-primary-8 flex items-center';

export default function EModelTitle() {
  const eModel = useAtomValue(eModelAtom);
  const eModelEditMode = useAtomValue(eModelEditModeAtom);
  const [eModelUIConfig, setEModelUIConfig] = useAtom(eModelUIConfigAtom);

  useEffect(() => {
    if (!eModelEditMode || !eModel) return;

    setEModelUIConfig((oldAtomData) => ({
      ...oldAtomData,
      name: eModel.name,
    }));
  }, [eModelEditMode, eModel, setEModelUIConfig]);

  const onEModelNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEModelUIConfig((oldAtomData) => ({
      ...oldAtomData,
      name: event.target.value || ' ',
    }));
  };

  const eModelName = eModelEditMode ? eModelUIConfig?.name : eModel?.name;

  if (!eModelName) return null;

  if (!eModelEditMode) {
    return <div className={titleStyle}>{eModelName}</div>;
  }

  const sameName = eModelUIConfig?.name === eModel?.name;

  return (
    <>
      <div className={titleStyle}>
        <input
          className="border-b-2 mr-2 w-1/2"
          type="text"
          defaultValue={eModel?.name}
          onChange={onEModelNameChange}
        />
        <EditPencilIcon style={{ width: 20, height: 20 }} />
      </div>
      <div>
        {sameName && (
          <div className="text-red-400 text-xs">
            EModel name should be different from the original
          </div>
        )}
      </div>
    </>
  );
}
