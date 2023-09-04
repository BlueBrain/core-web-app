import * as Dialog from '@radix-ui/react-dialog';
import GenerateMovieModal from '@/components/experiment-interactive/ExperimentInteractive/GenerateMovieModal';

export default function GenerateMoviePanel() {
  return (
    <div>
      <div className="w-40 h-10 px-5 py-2.5 bg-zinc-600 justify-center items-center gap-2.5 inline-flex">
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button type="button" className="text-white text-sm font-normal">
              Generate full movie
            </button>
          </Dialog.Trigger>
          <GenerateMovieModal />
        </Dialog.Root>
      </div>
    </div>
  );
}
