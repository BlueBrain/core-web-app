export type RoadmapFeatureDetailProps = {
  id: string;
  title: string;
  description: string;
  category: string;
  notes: Array<string>;
};

export default function RoadmapFeatureDetail({
  id,
  title,
  description,
  notes,
  category,
}: RoadmapFeatureDetailProps) {
  return (
    <div id={id} className="snap-start w-full bg-white">
      <div className="inline-flex flex-col px-12 mt-12 items-start justify-between gap-2 w-full">
        <div className="uppercase text-primary-8">{category}</div>
        <h2 className="text-3xl font-bold text-primary-8">{title}</h2>
      </div>
      <div className="pl-12 pr-4 py-8 bg-white w-full">
        <div className="w-3/5">
          <div className="w-full pb-4">
            <p className="text-base text-primary-8 font-light">{description}</p>
          </div>
          <ul className="border-y border-neutral-3 px-6 py-5 list-disc">
            {notes.map((note, ind) => (
              // eslint-disable-next-line react/no-array-index-key
              <li key={`note-${id}-${ind}`}>
                <p className="text-justify text-sm text-primary-8">{note}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
