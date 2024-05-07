import { useAtomValue } from 'jotai';

import { eModelPickedAtom } from '@/state/virtual-lab/build/me-model';
import { classNames } from '@/util/utils';
import EModelTracePreview from '@/components/explore-section/ExploreSectionListingView/EModelTracePreview';
import { ESeModel } from '@/types/explore-section/es';

const subtitleStyle = 'uppercase font-thin text-slate-600';

export default function EModelCard() {
  const eModelPicked = useAtomValue(eModelPickedAtom);

  if (!eModelPicked) return null;

  return (
    <div className="w-full border p-10">
      <div className="flex justify-between">
        <div className={classNames('text-2xl', subtitleStyle)}>E-Model</div>
        <a href={eModelPicked['@id']} target="_blank" className="font-bold text-primary-8">
          More details
        </a>
      </div>

      <div className="mt-2 flex gap-10">
        <EModelThumbnail emodel={eModelPicked} />
        <div className="flex-grow">
          <div className={subtitleStyle}>NAME</div>
          <div className="my-1 text-3xl font-bold text-primary-8">{eModelPicked.name}</div>
          <Details emodel={eModelPicked} />
        </div>
      </div>
    </div>
  );
}

function Details({ emodel }: { emodel: ESeModel }) {
  return (
    <div className="mt-4 grid grid-cols-3 gap-4 text-primary-8">
      <div>
        <div className={subtitleStyle}>Examplar morphology</div>
        <div>Unknown</div>
      </div>

      <div>
        <div className={subtitleStyle}>Optimization target</div>
        <div>Unknown</div>
      </div>

      <div>
        <div className={subtitleStyle}>Brain Region</div>
        <div>{emodel.brainRegion.label || 'Unknown'}</div>
      </div>

      <div>
        <div className={subtitleStyle}>E-Type</div>
        <div>{emodel.eType.label}</div>
      </div>
    </div>
  );
}

function EModelThumbnail({ emodel }: { emodel: ESeModel }) {
  if (!emodel.image)
    return (
      <div className="flex h-[200px] w-[200px] justify-center align-middle">E-Model thumbnail</div>
    );

  return (
    <div className="border border-black">
      <EModelTracePreview images={emodel.image} height={200} width={200} />
    </div>
  );
}
