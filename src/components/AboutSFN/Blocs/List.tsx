import slugify from '@/util/slugify';

export default function List({ title, list, id }: { title?: string; list: string[]; id: string }) {
  return (
    <div className="relative grid h-auto w-full grid-cols-2 self-center" id={slugify(id)}>
      {title && (
        <h2 className="relative self-center text-8xl font-bold uppercase tracking-wider">
          {title}
        </h2>
      )}
      <div className="flex flex-col pt-3">
        {list.map((item: string, index: number) => (
          <>
            {index !== 0 && <div className="mb-6 mt-3 block h-8 w-px bg-primary-3" />}
            <h3 className="font-sans text-3xl font-normal text-opacity-85 transition-opacity duration-300 ease-linear hover:opacity-100">
              {item}
            </h3>
          </>
        ))}
      </div>
    </div>
  );
}
