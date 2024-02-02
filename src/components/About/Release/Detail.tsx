import FilledCalendar from '@/components/icons/FilledCalendar';

type ReleaseFeature = {
  title: string;
  description: string;
  notes: Array<string>;
};

type ReleaseDetails = {
  id: string;
  version: string;
  date: string;
  title: string;
  description: string;
  features: {
    [key: string]: ReleaseFeature;
  };
};

type ReleaseFeatureItemProps = ReleaseFeature & { id: string; feature: string };

function ReleaseFeatureItem({ id, feature, title, description, notes }: ReleaseFeatureItemProps) {
  return (
    <div className="w-full snap-start">
      <h3 className="mb-2 text-lg font-bold capitalize text-primary-8">{title}</h3>
      <p className="mb-3 text-justify text-sm font-normal text-primary-8">{description}</p>
      <ul className="list-disc border-y border-neutral-3 px-6 py-5">
        {notes.map((note, ind) => (
          // eslint-disable-next-line react/no-array-index-key
          <li key={`note-${id}-${feature}-${ind}`}>
            <p className="text-justify text-sm text-primary-8">{note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Release({
  release: { id, title, date, features },
}: {
  release: ReleaseDetails;
}) {
  const FEATURES_KEYS = Object.keys(features);
  return (
    <div className="h-full w-full bg-white">
      <div className="mt-12 inline-flex w-full items-center justify-between gap-2 px-12">
        <h2 className="text-3xl font-bold text-primary-8">{title}</h2>
        <div className="grid grid-flow-col items-center justify-center gap-1">
          <FilledCalendar className="text-primary-8" />
          <span className="text-sm text-primary-8">
            {new Date(date).toLocaleDateString().replaceAll('/', '.')}
          </span>
        </div>
      </div>
      <div className="bg-white pl-12 pr-4">
        <div
          className="no-scrollbar grid w-full snap-x snap-mandatory grid-cols-[30%_30%] grid-rows-1 gap-10 overflow-x-scroll overscroll-x-contain bg-white py-12"
          style={{
            gridTemplateColumns: `repeat(${FEATURES_KEYS.length}, 19vw)`,
          }}
        >
          {FEATURES_KEYS.map((feat) => {
            const { title: noteTitle, description, notes } = features[feat];
            return (
              <ReleaseFeatureItem
                key={`${id}-${feat}`}
                {...{ id, description, notes, title: noteTitle, feature: feat }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
