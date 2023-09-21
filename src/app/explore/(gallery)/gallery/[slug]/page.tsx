import { client } from '@/api/sanity';

import HeaderSingleGallery from '@/components/explore-section/Gallery/HeaderSingleGallery';
import GalleryVisualliser from '@/components/explore-section/Gallery/GalleryVisualiser';

export default async function SingleGalleryPage({ params }: { params: { slug: string } }) {
  console.log(params.slug);

  const galleryContent =
    await client.fetch(`*[_type == 'galleries' && slug.current == '${params.slug}'][0]{
    name, 
    slug,
    description,
    imageList,
    }
  `);

  return (
    <div className="flex flex-row flex-nowrap justify-between w-screen h-screen bg-black">
      <HeaderSingleGallery name={galleryContent.name} description={galleryContent.description} />
      <GalleryVisualliser content={galleryContent} />
    </div>
  );
}
