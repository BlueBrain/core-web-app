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
    <div className="relative flex w-full flex-col justify-center md:flex md:flex-col md:gap-4 xl:flex">
      <div className="relative flex h-[30vh] w-full items-center justify-center overflow-hidden px-8 xl:h-[36vh]">
        <Image
          fill
          src={image}
          alt={title}
          className="aspect-square h-auto w-full md:object-contain xl:object-fill"
        />
      </div>
      <aside className="relative right-0 flex w-full flex-col gap-y-3 bg-primary-9 p-12 md:pl-0 md:pt-0 xl:absolute xl:w-[32vw]  xl:p-12">
        <h4 className="text-3xl font-black uppercase tracking-[0.06em] md:text-4xl xl:text-5xl">
          {title}
        </h4>
        <p className="font-sans text-xl font-light leading-normal">{paragraph}</p>
      </aside>
    </div>
  );
}
