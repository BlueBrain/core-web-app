import * as Dialog from '@radix-ui/react-dialog';
import GenerateMovieModal from '@/components/experiment-interactive/ExperimentInteractive/GenerateMovieModal';

export default function GenerateMoviePanel() {
  return (
    <div>
      <div className="inline-flex h-10 w-40 items-center justify-center gap-2.5 bg-zinc-600 px-5 py-2.5">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button type="button" className="text-sm font-normal text-white">
              Generate full movie
            </button>
          </Dialog.Trigger>
          <GenerateMovieModal />
        </Dialog.Root>
      </div>
    </div>
  );
}
