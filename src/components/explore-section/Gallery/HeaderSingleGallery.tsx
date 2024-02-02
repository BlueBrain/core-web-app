import Link from 'next/link';
import { ArrowLeftIcon } from '@/components/icons';

type HeaderSingleGalleryProps = {
  title: string;
  description: string;
};

export default function HeaderSingleGallery({ title, description }: HeaderSingleGalleryProps) {
  return (
    <div className="fixed left-0 top-0 z-10 flex h-full w-1/4 flex-col p-6">
      <div className="flex flex-col">
        <h1 className="inline text-5xl font-bold leading-none text-white">{title}</h1>
        <p className="mt-2 w-2/3 font-thin leading-5 text-neutral-3">{description}</p>
        <Link href="/explore/gallery">
          <button
            type="button"
            className="ease-liner mt-4 flex flex-row items-center border-b-0 border-solid border-b-neutral-4 bg-transparent pb-1 text-sm uppercase tracking-wider text-white transition-all duration-300 hover:border-b "
          >
            <ArrowLeftIcon className="h-2.5 w-auto" />
            <div className="ml-2 block">Back to the list</div>
          </button>
        </Link>
      </div>
    </div>
  );
}
