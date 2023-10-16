import { useAtom, useAtomValue } from 'jotai';
import { useState } from 'react';

import {
  configIsFulfilled,
  eModelEditModeAtom,
  eModelUIConfigAtom,
  selectedEModelAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { classNames } from '@/util/utils';
import GenericButton from '@/components/Global/GenericButton';
import { isConfigEditableAtom } from '@/state/brain-model-config';
import {
  EModelBuildingPlaceholders,
  WORKFLOW_EMODEL_BUILD_TASK_NAME,
} from '@/services/bbp-workflow/config';
import WorkflowLauncherBtn from '@/components/WorkflowLauncherBtn';

const positionStyle = 'absolute bottom-5 right-5 flex items-center gap-3';
const defaultButtonColor = 'border-primary-8 text-primary-8 bg-white';

type Props = {
  className?: string;
};

export default function EditConfigButton({ className }: Props) {
  const [eModelEditMode, setEModelEditMode] = useAtom(eModelEditModeAtom);
  const isConfigEditable = useAtomValue(isConfigEditableAtom);
  const [isLoading, setIsLoading] = useState(false);
  const eModelUIConfig = useAtomValue(eModelUIConfigAtom);
  const selectedEModel = useAtomValue(selectedEModelAtom);

  const extraVariablesToReplace = {
    [EModelBuildingPlaceholders.E_MODEL_NAME]: eModelUIConfig?.name,
    [EModelBuildingPlaceholders.E_TYPE]: eModelUIConfig?.eType,
    [EModelBuildingPlaceholders.BRAIN_REGION]: eModelUIConfig?.brainRegionName,
    [EModelBuildingPlaceholders.UUID]: crypto.randomUUID(),
    [EModelBuildingPlaceholders.OPTIMIZATION_CONFIG_ID]: selectedEModel?.id,
  };

  const configIsOk = eModelUIConfig && configIsFulfilled(eModelUIConfig);

  const body = !eModelEditMode ? (
    <GenericButton
      text="Edit config"
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
      <WorkflowLauncherBtn
        buttonText="Build model"
        workflowName={WORKFLOW_EMODEL_BUILD_TASK_NAME}
        extraVariablesToReplace={extraVariablesToReplace}
        onLaunchingChange={() => setIsLoading((loading) => !loading)}
        disabled={isLoading || !configIsOk}
        className="border-green-600 text-white bg-green-600"
      />
    </>
  );

  return <div className={classNames(className, positionStyle)}>{body}</div>;
}
