import Image from 'next/image';

export default function SingleGalleryItem({
  title,
  paragraph,
  image,
}: {
  title: string;
  paragraph: string;
  image: string;
}) {
  return (
    <div className="relative flex w-full flex-col justify-center">
      <div className="relative flex h-[50vh] w-full items-center justify-center overflow-hidden">
        <Image
          src={image}
          alt="placeholder image"
          width={800}
          height={800}
          className="h-auto w-full object-fill"
        />
      </div>
      <aside className="absolute right-0 flex w-[32vw] flex-col gap-y-3 bg-primary-9 p-12">
        <h4 className="text-5xl font-black uppercase tracking-[0.06em]">{title}</h4>
        <p className="font-sans text-xl font-light leading-normal">{paragraph}</p>
      </aside>
    </div>
  );
}