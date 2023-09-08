import { ChevronIcon } from '@/components/icons';
import { GalleryImagesType } from '@/types/explore-gallery';

type NavigationProps = {
  currentImageContent: GalleryImagesType;
  navigate: (direction: string) => void;
  totalImages: number;
  currentImage: number;
};

export function SingleInfoBox({ content, label }: { content: string; label: string }) {
  return (
    <div className="flex flex-row">
      <div className="block w-32 font-normal text-neutral-2">{label}</div>
      <div className="block font-semibold text-white">{content}</div>
    </div>
  );
}

export default function Navigation({
  currentImageContent,
  navigate,
  totalImages,
  currentImage,
}: NavigationProps) {
  return (
    <div className="fixed w-15vw bottom-6 left-6 flex flex-col z-50">
      <header className="w-full flex flex-col mb-12 text-white">
        <div className="w-full flex flex-row items-center justify-between">
          <button type="button" onClick={(e) => navigate(e.currentTarget.name)} name="previous">
            <ChevronIcon className="w-auto h-3 origin-center rotate-180" />
          </button>

          <div className="flex flex-row items-center text-base">
            <div className="font-bold">{currentImage + 1}</div>
            <div className="w-6 h-px bg-neutral-4 mx-2" />
            <div className="font-light">{totalImages}</div>
          </div>
          <button type="button" onClick={(e) => navigate(e.currentTarget.name)} name="next">
            <ChevronIcon className="w-auto h-3" />
          </button>
        </div>

        <div className="text-xl text-white font-bold mt-2 leading-tight">
          {currentImageContent.name}
        </div>
      </header>

      <div className="flex flex-col gap-y-1">
        <SingleInfoBox label="Credits" content={currentImageContent.credit} />
        <div className="block w-full h-px bg-neutral-5" />
        <SingleInfoBox label="Year" content={currentImageContent.year} />
        <div className="block w-full h-px bg-neutral-5" />
        <SingleInfoBox label="Software" content={currentImageContent.software} />
      </div>
    </div>
  );
}
