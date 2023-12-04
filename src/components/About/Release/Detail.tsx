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
    <div className="snap-start w-full">
      <h3 className="text-lg text-primary-8 font-bold capitalize mb-2">{title}</h3>
      <p className="text-sm font-normal text-primary-8 mb-3 text-justify">{description}</p>
      <ul className="border-y border-neutral-3 px-6 py-5 list-disc">
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
    <div className="w-full h-full bg-white">
      <div className="inline-flex px-12 mt-12 items-center justify-between gap-2 w-full">
        <h2 className="text-3xl font-bold text-primary-8">{title}</h2>
        <div className="grid grid-flow-col gap-1 items-center justify-center">
          <FilledCalendar className="text-primary-8" />
          <span className="text-primary-8 text-sm">
            {new Date(date).toLocaleDateString().replaceAll('/', '.')}
          </span>
        </div>
      </div>
      <div className="pl-12 pr-4 bg-white">
        <div
          className="grid grid-cols-[30%_30%] grid-rows-1 gap-10 w-full py-12 bg-white overflow-x-scroll no-scrollbar snap-x snap-mandatory overscroll-x-contain"
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
