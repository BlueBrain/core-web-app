import { SINGLE_GALLERY_LIST_CONTENT } from '@/constants/explore-section/gallery-content';
import HeaderSingleGallery from '@/components/explore-section/Gallery/HeaderSingleGallery';
import GalleryVisualliser from '@/components/explore-section/Gallery/GalleryVisualiser';

export default function SingleGalleryPage() {
  return (
    <div className="flex flex-row flex-nowrap justify-between w-screen h-screen bg-black">
      <HeaderSingleGallery
        title={SINGLE_GALLERY_LIST_CONTENT.name}
        description={SINGLE_GALLERY_LIST_CONTENT.description}
      />
      <GalleryVisualliser content={SINGLE_GALLERY_LIST_CONTENT} />
    </div>
  );
}
