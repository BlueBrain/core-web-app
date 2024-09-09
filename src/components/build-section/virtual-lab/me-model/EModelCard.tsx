import { useAtomValue } from 'jotai';
import { Empty } from 'antd';
import { useParams, useRouter } from 'next/navigation';

import { selectedEModelAtom } from '@/state/virtual-lab/build/me-model';
import { classNames } from '@/util/utils';
import EModelTracePreview from '@/components/explore-section/ExploreSectionListingView/EModelTracePreview';
import { EModel } from '@/types/e-model';
import { DisplayMessages } from '@/constants/display-messages';
import { detailUrlWithinLab } from '@/util/common';
import { ModelTypeNames } from '@/constants/explore-section/data-types/model-data-types';
import { BookmarkTabsName } from '@/types/virtual-lab/bookmark';
import Link from '@/components/Link';

const subtitleStyle = 'uppercase font-thin text-slate-600';

export default function EModelCard() {
  const selectedEModel = useAtomValue(selectedEModelAtom);
  const { virtualLabId, projectId } = useParams<{
    virtualLabId?: string;
    projectId?: string;
  }>();

  const generateDetailUrl = () => {
    if (!selectedEModel) return '';
    if (!virtualLabId || !projectId) return selectedEModel['@id'];

    const idParts = selectedEModel['@id'].split('/');
    const orgProj = `${idParts.at(-3)}/${idParts.at(-2)}`;
    return detailUrlWithinLab(
      virtualLabId,
      projectId,
      orgProj,
      selectedEModel['@id'],
      BookmarkTabsName.MODELS,
      ModelTypeNames.E_MODEL
    );
  };

  const router = useRouter();

  if (!selectedEModel)
    return (
      <button
        type="button"
        onClick={() => {
          router.push('configure/e-model');
        }}
        className="flex h-48 w-full items-center rounded-lg border border-neutral-2 pl-32 text-4xl text-neutral-4 hover:bg-primary-7 hover:text-white"
      >
        Select e-model
      </button>
    );

  return (
    <div className="w-full rounded-lg border p-10">
      <div className="flex justify-between">
        <div className={classNames('text-2xl', subtitleStyle)}>E-Model</div>
        <Link href={generateDetailUrl()} target="_blank" className="font-bold text-primary-8">
          More details
        </Link>
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
        <div>{DisplayMessages.NO_DATA_STRING}</div>
      </div>

      <div>
        <div className={subtitleStyle}>Optimization target</div>
        <div>{DisplayMessages.NO_DATA_STRING}</div>
      </div>

      <div>
        <div className={subtitleStyle}>Brain Region</div>
        <div>{emodel.brainLocation?.brainRegion?.label || DisplayMessages.NO_DATA_STRING}</div>
      </div>

      <div>
        <div className={subtitleStyle}>E-Type</div>
        <div>{emodel.eType || DisplayMessages.NO_DATA_STRING}</div>
      </div>
    </div>
  );
}

export function EModelThumbnail({ emodel }: { emodel: EModel }) {
  if (!emodel.image)
    return <Empty description="No thumbnail available" image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  return (
    <div className="border border-black">
      <EModelTracePreview images={emodel.image} height={200} width={200} />
    </div>
  );
}
