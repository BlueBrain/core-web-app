import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useState } from 'react';

import { eModelEditModeAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';
import { classNames } from '@/util/utils';
import GenericButton from '@/components/Global/GenericButton';
import { isConfigEditableAtom } from '@/state/brain-model-config';
import { cloneEModelConfigAtom } from '@/state/brain-model-config/cell-model-assignment/e-model/setters';

const positionStyle = 'absolute bottom-5 right-5 flex items-center gap-3';
const defaultButtonColor = 'border-primary-8 text-primary-8 bg-white';

type Props = {
  className?: string;
};

export default function CloneConfigButton({ className }: Props) {
  const [eModelEditMode, setEModelEditMode] = useAtom(eModelEditModeAtom);
  const isConfigEditable = useAtomValue(isConfigEditableAtom);
  const [isLoading, setIsLoading] = useState(false);
  const cloneEModelConfig = useSetAtom(cloneEModelConfigAtom);

  const handleClone = async () => {
    setIsLoading(true);
    await cloneEModelConfig();
    setIsLoading(false);
    setEModelEditMode(true);
  };

  const body = !eModelEditMode ? (
    <GenericButton
      text="Clone config"
      onClick={handleClone}
      className={`${defaultButtonColor} ${isConfigEditable ? '' : 'cursor-not-allowed'}`}
      disabled={!isConfigEditable}
      loading={isLoading}
    />
  ) : (
    <>
      <GenericButton
        text="Cancel"
        onClick={() => setEModelEditMode(false)}
        className={defaultButtonColor}
      />
      <GenericButton text="Build model" className="border-green-600 bg-green-600 text-white" />
    </>
  );

  return <div className={classNames(className, positionStyle)}>{body}</div>;
}
