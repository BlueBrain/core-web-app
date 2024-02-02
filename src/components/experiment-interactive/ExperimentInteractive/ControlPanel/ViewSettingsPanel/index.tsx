import { Button } from 'antd';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';

import DisplayWholeBrainCheckbox from './DisplayWholeBrainCheckbox';
import ResetViewButton from './ResetViewButton';
import { ZoomInIcon, ZoomOutIcon } from '@/components/icons';
import { useExperimentInteractive } from '@/components/experiment-interactive/ExperimentInteractive/hooks';
import BraynsService from '@/services/brayns/circuit';
import AxisGizmo from '@/components/InteractiveBrayns/AxisGizmo/AxisGizmo';

export default function ViewSettingsPanel() {
  const { isViewSettingsPanelVisible, hideViewSettingsPanel } = useExperimentInteractive();

  return (
    <div
      className={`absolute right-0 top-0 flex w-[250px] flex-col rounded-bl-3xl rounded-tl-3xl bg-black px-3 py-5 text-white ${
        isViewSettingsPanelVisible ? `` : `hidden`
      }`}
    >
      <div className="flex flex-row items-center justify-between text-lg">
        View settings
        <button
          type="button"
          className="text-white"
          onClick={hideViewSettingsPanel}
          aria-label="Hide panel"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex aspect-square w-full flex-col items-center justify-center">
        {/* This needs connecting to Brayns camera  */}
        <AxisGizmo camera={BraynsService.CameraTransform} />
      </div>

      <div className="p-3">
        <div className="flex flex-row items-center gap-3 text-3xl">
          <Button type="text">
            <ZoomOutIcon className="h-[16px] w-[16px]" />
          </Button>
          <div className="relative w-full flex-grow">
            <div className="h-[1px] w-full bg-white text-center" />
            <div className="absolute left-1/2 h-[15px] w-[3px] -translate-y-1/2 bg-white" />
          </div>
          <Button type="text">
            <ZoomInIcon className="h-[16px] w-[16px]" />
          </Button>
        </div>
      </div>

      <DisplayWholeBrainCheckbox />

      <div className="mt-3 border-t border-t-white/20">
        <ResetViewButton />
      </div>
    </div>
  );
}
