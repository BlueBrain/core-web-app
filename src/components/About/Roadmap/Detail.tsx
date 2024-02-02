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
    <div id={id} className="w-full snap-start bg-white">
      <div className="mt-12 inline-flex w-full flex-col items-start justify-between gap-2 px-12">
        <div className="uppercase text-primary-8">{category}</div>
        <h2 className="text-3xl font-bold text-primary-8">{title}</h2>
      </div>
      <div className="w-full bg-white py-8 pl-12 pr-4">
        <div className="w-3/5">
          <div className="w-full pb-4">
            <p className="text-base font-light text-primary-8">{description}</p>
          </div>
          <ul className="list-disc border-y border-neutral-3 px-6 py-5">
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
