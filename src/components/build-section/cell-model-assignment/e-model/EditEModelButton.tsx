import { useAtom, useAtomValue } from 'jotai';

import { eModelEditModeAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';
import { classNames } from '@/util/utils';
import GenericButton from '@/components/Global/GenericButton';
import { isConfigEditableAtom } from '@/state/brain-model-config';

const positionStyle = 'absolute bottom-5 right-5 flex items-center gap-3';
const defaultButtonColor = 'border-primary-8 text-primary-8 bg-white';

type Props = {
  className?: string;
};

export default function EditEModelButton({ className }: Props) {
  const [eModelEditMode, setEModelEditMode] = useAtom(eModelEditModeAtom);
  const isConfigEditable = useAtomValue(isConfigEditableAtom);

  const body = !eModelEditMode ? (
    <GenericButton
      text="Edit model"
      onClick={() => setEModelEditMode(true)}
      className={`${defaultButtonColor} ${isConfigEditable ? '' : 'cursor-not-allowed'}`}
      disabled={!isConfigEditable}
    />
  ) : (
    <>
      <GenericButton
        text="Cancel"
        onClick={() => setEModelEditMode(false)}
        className={defaultButtonColor}
      />
      <GenericButton text="Build model" className="border-green-600 text-white bg-green-600" />
    </>
  );

  return <div className={classNames(className, positionStyle)}>{body}</div>;
}
