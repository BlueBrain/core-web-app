import { useAtomValue } from 'jotai';
import { useParams } from 'next/navigation';

import { selectedMModelAtom } from '@/state/virtual-lab/build/me-model';
import { classNames } from '@/util/utils';
import { NeuronMorphology } from '@/types/e-model';
import CardVisualization from '@/components/explore-section/CardView/CardVisualization';
import { DataType } from '@/constants/explore-section/list-views';
import { DisplayMessages } from '@/constants/display-messages';
import { mTypeSelectorFn } from '@/util/explore-section/selector-functions';
import { ExperimentTypeNames } from '@/constants/explore-section/data-types/experiment-data-types';
import { detailUrlWithinLab } from '@/util/common';
import { BookmarkTabsName } from '@/types/virtual-lab/bookmark';
import Link from '@/components/Link';

const subtitleStyle = 'uppercase font-thin text-slate-600';

export default function MorphologyCard() {
  const selectedMModel = useAtomValue(selectedMModelAtom);
  const { virtualLabId, projectId } = useParams<{
    virtualLabId?: string;
    projectId?: string;
  }>();

  const generateDetailUrl = () => {
    if (!selectedMModel) return '';
    if (!virtualLabId || !projectId) return selectedMModel['@id'];

    const idParts = selectedMModel['@id'].split('/');
    const orgProj = `${idParts.at(-3)}/${idParts.at(-2)}`;
    return detailUrlWithinLab(
      virtualLabId,
      projectId,
      orgProj,
      selectedMModel['@id'],
      BookmarkTabsName.EXPERIMENTS,
      ExperimentTypeNames.MORPHOLOGY
    );
  };

  if (!selectedMModel) return null;

  return (
    <div className="w-full border p-10">
      <div className="flex justify-between">
        <div className={classNames('text-2xl', subtitleStyle)}>M-Model</div>
        <Link href={generateDetailUrl()} target="_blank" className="font-bold text-primary-8">
          More details
        </Link>
      </div>

      <div className="mt-2 flex gap-10">
        <div className="border border-black">
          <CardVisualization
            dataType={DataType.ExperimentalNeuronMorphology}
            resource={selectedMModel}
            height={200}
            width={200}
          />
        </div>
        <div className="flex-grow">
          <div className={subtitleStyle}>NAME</div>
          <div className="my-1 text-3xl font-bold text-primary-8">{selectedMModel.name}</div>
          <MorphDetails morph={selectedMModel} />
        </div>
      </div>
    </div>
  );
}

function MorphDetails({ morph }: { morph: NeuronMorphology }) {
  return (
    <div className="mt-4 grid grid-cols-3 gap-4 text-primary-8">
      <div>
        <div className={subtitleStyle}>Brain Region</div>
        <div>{morph.brainLocation?.brainRegion?.label || DisplayMessages.UNKNOWN}</div>
      </div>

      <div>
        <div className={subtitleStyle}>Species</div>
        <div>{morph.subject?.species?.label || DisplayMessages.UNKNOWN}</div>
      </div>

      <div>
        <div className={subtitleStyle}>License</div>
        <a href={morph.license?.['@id']} target="_blank">
          Open 🔗
        </a>
      </div>

      <div>
        <div className={subtitleStyle}>M-Type</div>
        <div>{mTypeSelectorFn(morph) || DisplayMessages.UNKNOWN}</div>
      </div>

      <div>
        <div className={subtitleStyle}>Age</div>
        <div>{DisplayMessages.UNKNOWN}</div>
      </div>
    </div>
  );
}
