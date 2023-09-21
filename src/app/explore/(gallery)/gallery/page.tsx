
import { client } from '@/api/sanity';
import HomeHeader from '@/components/Global/HomeHeader';
import { SingleGalleryContentType } from '@/types/explore-gallery';
import Card from '@/components/explore-section/Gallery/Card';

export default async function GalleryPage() {

  const galleryContent = await client.fetch(`*[_type == 'galleries'][]{
    name, 
    slug,
    description,
    imageList,
    }
  `);

  return (
    <div className="relative flex flex-row-reverse justify-start w-screen min-h-screen flex-nowrap bg-primary-9">
      <HomeHeader
        title="Galleries"
        description="Here is a description of what can be achieved  in this app. What is expected from the user and what is the output..."
        buttonLabel="Back to explore"
        link="/explore"
      />

      {/* <div className="w-2/3 grid grid-cols-3 gap-4 py-6 pr-10"> */}
      <div className="w-2/3 flex flex-row flex-wrap items-start gap-4 py-6 pr-10">
        {galleryContent.map((singleContent: SingleGalleryContentType) => (
          <Card content={singleContent} key={`gallery-${singleContent.name}`} />
        ))}
      </div>
    </div>
  );
}
