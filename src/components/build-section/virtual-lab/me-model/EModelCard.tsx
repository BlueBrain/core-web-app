import { useAtomValue } from 'jotai';
import { Empty } from 'antd';

import { selectedEModelAtom } from '@/state/virtual-lab/build/me-model';
import { classNames } from '@/util/utils';
import EModelTracePreview from '@/components/explore-section/ExploreSectionListingView/EModelTracePreview';
import { EModel } from '@/types/e-model';
import { DisplayMessages } from '@/constants/display-messages';

const subtitleStyle = 'uppercase font-thin text-slate-600';

export default function EModelCard() {
  const selectedEModel = useAtomValue(selectedEModelAtom);

  if (!selectedEModel) return null;

  return (
    <div className="w-full border p-10">
      <div className="flex justify-between">
        <div className={classNames('text-2xl', subtitleStyle)}>E-Model</div>
        <a href={selectedEModel['@id']} target="_blank" className="font-bold text-primary-8">
          More details
        </a>
      </div>

      <div className="mt-2 flex gap-10">
        <EModelThumbnail emodel={selectedEModel} />
        <div className="flex-grow">
          <div className={subtitleStyle}>NAME</div>
          <div className="my-1 text-3xl font-bold text-primary-8">{selectedEModel.name}</div>
          <Details emodel={selectedEModel} />
        </div>
      </div>
    </div>
  );
}

function Details({ emodel }: { emodel: EModel }) {
  return (
    <div className="mt-4 grid grid-cols-3 gap-4 text-primary-8">
      <div>
        <div className={subtitleStyle}>Examplar morphology</div>
        <div>{DisplayMessages.UNKNOWN}</div>
      </div>

      <div>
        <div className={subtitleStyle}>Optimization target</div>
        <div>{DisplayMessages.UNKNOWN}</div>
      </div>

      <div>
        <div className={subtitleStyle}>Brain Region</div>
        <div>{emodel.brainLocation?.brainRegion?.label || DisplayMessages.UNKNOWN}</div>
      </div>

      <div>
        <div className={subtitleStyle}>E-Type</div>
        <div>{emodel.eType || DisplayMessages.UNKNOWN}</div>
      </div>
    </div>
  );
}

function EModelThumbnail({ emodel }: { emodel: EModel }) {
  if (!emodel.image)
    return <Empty description="No thumbnail available" image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <div className="border border-black">
      <EModelTracePreview images={emodel.image} height={200} width={200} />
    </div>
  );
}
