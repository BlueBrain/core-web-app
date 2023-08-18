import { Header } from "@radix-ui/react-accordion"
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons"
import { GalleryImages } from "@/constants/explore-section/gallery-content"


type NavigationProps = {
  currentImageContent: GalleryImages,
  navigate: (direction: string) => void,
  totalImages: number,
  currentImage: number
}

export function SingleInfoBox({
  content,
  label,
}:{
  content: string;
  label: string;
}) {
  return (
    <div className="flex flex-row text-neutral-3 font-normal">
      <div className="w-42">{ label }</div>
      <span>{ content }</span>
    </div>
  )
}

export default function Navigation({
  currentImageContent,
  navigate,
  totalImages,
  currentImage
}: NavigationProps) {
  return (
    <div className="fixed bottom-2 left-2 flex flex-col">
      <Header className="flex flex-row items-center mb-12">
        <button type="button" onClick={ (e) => navigate(e.currentTarget.name) } name="previous">
          <ArrowLeftIcon className="w-6 h-6 text-white" />
        </button>
        <div className="flex flex-row items-center">
          { currentImage + 1 }
          <div className="w-6 h-px bg-white mx-2" />
          { totalImages }
        </div>
        <button type="button" onClick={ (e) => navigate(e.currentTarget.name) } name="next">
          <ArrowRightIcon className="w-6 h-6 text-white" />
        </button>
      </Header>

      <div className="flex flex-col gap-y-2">
        <SingleInfoBox label="Credits" content={ currentImageContent.credit } />
        <SingleInfoBox label="Year" content={ currentImageContent.year } />
        <SingleInfoBox label="Software" content={ currentImageContent.software } />
      </div>
    </div>
  )
}