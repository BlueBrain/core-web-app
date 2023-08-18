import Link from 'next/link';
import { ArrowLeftIcon } from '@/components/icons';

type HeaderSingleGalleryProps = {
  title: string;
  description: string;
};

export default function HeaderSingleGallery({ title, description }: HeaderSingleGalleryProps) {
  return (
    <div className="fixed z-10 top-0 left-0 w-1/4 h-full flex flex-col p-6">
      <div className="flex flex-col">
        <h1 className="text-white text-5xl font-bold inline leading-none">{title}</h1>
        <p className="mt-2 font-thin leading-5 text-neutral-3 w-2/3">{description}</p>
        <Link href="/explore/gallery">
          <button
            type="button"
            className="flex flex-row items-center bg-transparent text-sm text-white mt-4 pb-1 uppercase border-b-0 border-solid border-b-neutral-4 tracking-wider transition-all ease-liner duration-300 hover:border-b "
          >
            <ArrowLeftIcon className="w-auto h-2.5" />
            <div className="block ml-2">Back to the list</div>
          </button>
        </Link>
      </div>
    </div>
  );
}
