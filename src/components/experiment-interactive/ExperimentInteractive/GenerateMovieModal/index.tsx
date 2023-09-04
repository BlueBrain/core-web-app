import * as Dialog from '@radix-ui/react-dialog';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';

import SelectSimulationsBox from './SelectSimulationsBox';
import SimulationRangeInputs from './SimulationRangeInputs';

export default function GenerateMovieModal() {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="bg-black/70 fixed animation-[overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)] w-screen h-screen top-0 left-0" />
      <Dialog.Content className="bg-black fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-5 text-white flex flex-col gap-2">
        <Dialog.Title className="text-white font-bold text-2xl">Generate full movie</Dialog.Title>

        <Dialog.Description className="text-white">
          Once the render is done, we will send you the link to download the full movie
        </Dialog.Description>

        <div className="mt-10 mb-5 flex flex-col gap-2">
          <SimulationRangeInputs />

          <SelectSimulationsBox />
        </div>

        <div className="flex mt-5 justify-end">
          <Dialog.Close asChild>
            <button type="button" className="p-3 px-5 border border-white">
              Send
            </button>
          </Dialog.Close>
        </div>

        <Dialog.Close asChild>
          <button type="button" className="absolute top-3 right-3 text-white/50" aria-label="Close">
            <CloseIcon />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
