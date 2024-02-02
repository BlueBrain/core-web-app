import * as Dialog from '@radix-ui/react-dialog';
import { CloseIcon } from 'next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon';

import SelectSimulationsBox from './SelectSimulationsBox';
import SimulationRangeInputs from './SimulationRangeInputs';

export default function GenerateMovieModal() {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="animation-[overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)] fixed left-0 top-0 h-screen w-screen bg-black/70" />
      <Dialog.Content className="fixed left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col gap-2 bg-black p-5 text-white">
        <Dialog.Title className="text-2xl font-bold text-white">Generate full movie</Dialog.Title>

        <Dialog.Description className="text-white">
          Once the render is done, we will send you the link to download the full movie
        </Dialog.Description>

        <div className="mb-5 mt-10 flex flex-col gap-2">
          <SimulationRangeInputs />

          <SelectSimulationsBox />
        </div>

        <div className="mt-5 flex justify-end">
          <Dialog.Close asChild>
            <button type="button" className="border border-white p-3 px-5">
              Send
            </button>
          </Dialog.Close>
        </div>

        <Dialog.Close asChild>
          <button type="button" className="absolute right-3 top-3 text-white/50" aria-label="Close">
            <CloseIcon />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
