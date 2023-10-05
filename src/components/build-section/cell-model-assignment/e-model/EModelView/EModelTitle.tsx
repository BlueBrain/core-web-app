import { useAtom, useAtomValue } from 'jotai';
import { ChangeEvent, useEffect } from 'react';

import ErrorMessageLine from './ErrorMessageLine';
import {
  eModelEditModeAtom,
  eModelNameAtom,
  eModelUIConfigAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import EditPencilIcon from '@/components/icons/EditPencil';

const titleStyle = 'text-3xl font-bold text-primary-8 flex items-center';

export default function EModelTitle() {
  const eModelName = useAtomValue(eModelNameAtom);
  const eModelEditMode = useAtomValue(eModelEditModeAtom);
  const [eModelUIConfig, setEModelUIConfig] = useAtom(eModelUIConfigAtom);

  useEffect(() => {
    if (!eModelEditMode || !eModelName) return;

    setEModelUIConfig((oldAtomData) => ({
      ...oldAtomData,
      name: eModelName,
    }));
  }, [eModelEditMode, eModelName, setEModelUIConfig]);

  const onEModelNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEModelUIConfig((oldAtomData) => ({
      ...oldAtomData,
      name: event.target.value || '',
    }));
  };

  const currentName = eModelEditMode ? eModelUIConfig?.name : eModelName;

  if (!eModelEditMode) {
    return <div className={titleStyle}>{currentName}</div>;
  }

  return (
    <>
      <div className={titleStyle}>
        <input
          className="border-b-2 mr-2 w-1/2"
          type="text"
          defaultValue={currentName || ''}
          onChange={onEModelNameChange}
        />
        <EditPencilIcon style={{ width: 20, height: 20 }} />
      </div>

      <ErrorMessageLine message={currentName ? '' : 'Name is required'} />
    </>
  );
}
