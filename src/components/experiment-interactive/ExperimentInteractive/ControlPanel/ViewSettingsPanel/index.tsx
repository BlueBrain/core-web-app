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
      className={`absolute right-0 top-0 w-[250px] flex flex-col text-white bg-black px-3 py-5 rounded-tl-3xl rounded-bl-3xl ${
        isViewSettingsPanelVisible ? `` : `hidden`
      }`}
    >
      <div className="flex flex-row justify-between text-lg items-center">
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

      <div className="flex flex-col w-full aspect-square justify-center items-center">
        {/* This needs connecting to Brayns camera  */}
        <AxisGizmo camera={BraynsService.CameraTransform} />
      </div>

      <div className="p-3">
        <div className="flex flex-row items-center text-3xl gap-3">
          <Button type="text">
            <ZoomOutIcon className="w-[16px] h-[16px]" />
          </Button>
          <div className="w-full flex-grow relative">
            <div className="text-center w-full bg-white h-[1px]" />
            <div className="w-[3px] h-[15px] absolute left-1/2 bg-white -translate-y-1/2" />
          </div>
          <Button type="text">
            <ZoomInIcon className="w-[16px] h-[16px]" />
          </Button>
        </div>
      </div>

      <DisplayWholeBrainCheckbox />

      <div className="border-t border-t-white/20 mt-3">
        <ResetViewButton />
      </div>
    </div>
  );
}
