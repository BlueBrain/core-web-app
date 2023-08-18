import { SingleGalleryContent } from "@/constants/explore-section/gallery-content"
import HeaderSingleGallery from "@/components/explore-section/Gallery/HeaderSingleGallery"
import GalleryVisualliser from "@/components/explore-section/Gallery/GalleryVisualiser"

export default function SingleGalleryPage() {

  return (
    <div className="flex flex-row flex-nowrap justify-between w-screen h-screen bg-black">
      <HeaderSingleGallery
        title={SingleGalleryContent.name}
        description={SingleGalleryContent.description}
        />
      <GalleryVisualliser content={SingleGalleryContent} />
    </div>
  )
}