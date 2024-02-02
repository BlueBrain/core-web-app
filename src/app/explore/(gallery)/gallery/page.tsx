import HomeHeader from '@/components/Global/HomeHeader';
import { GALLERY_LIST_CONTENT } from '@/constants/explore-section/gallery-content';
import { SingleGallery } from '@/types/explore-gallery';
import Card from '@/components/explore-section/Gallery/Card';

export default function GalleryPage() {
  return (
    <div className="relative flex min-h-screen w-screen flex-row-reverse flex-nowrap justify-start bg-primary-9">
      <HomeHeader
        title="Galleries"
        description="Here is a description of what can be achieved  in this app. What is expected from the user and what is the output..."
        buttonLabel="Back to explore"
        link="/explore"
      />

      <div className="grid w-2/3 grid-cols-3 gap-4 py-6 pr-10">
        {GALLERY_LIST_CONTENT.map((singleContent: SingleGallery) => (
          <Card content={singleContent} key={`gallery-${singleContent.title}`} />
        ))}
      </div>
    </div>
  );
}
