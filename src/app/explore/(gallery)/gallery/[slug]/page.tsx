export default function SingleGalleryPage({
  params
}: {
  params: {
    slug: string
  }
}) {
  return (
    <div className="w-screen h-screen bg-primary-9">
      <h1 className="text-white text-4xl font-bold">
        {params.slug}
      </h1>
    </div>
  )
}