import { useAtomValue } from 'jotai';

import { selectedMModelAtom } from '@/state/virtual-lab/build/me-model';
import { classNames } from '@/util/utils';
import { NeuronMorphology } from '@/types/e-model';
import PreviewThumbnail from '@/components/explore-section/ExploreSectionListingView/PreviewThumbnail';
import { DataType } from '@/constants/explore-section/list-views';
import { DisplayMessages } from '@/constants/display-messages';

const subtitleStyle = 'uppercase font-thin text-slate-600';

export default function MorphologyCard() {
  const selectedMModel = useAtomValue(selectedMModelAtom);

  if (!selectedMModel) return null;

  return (
    <div className="w-full border p-10">
      <div className="flex justify-between">
        <div className={classNames('text-2xl', subtitleStyle)}>M-Model</div>
        <a href={selectedMModel['@id']} target="_blank" className="font-bold text-primary-8">
          More details
        </a>
      </div>

      <div className="mt-2 flex gap-10">
        <MorphImage morph={selectedMModel} />
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
        <div>{morph?.mType || DisplayMessages.UNKNOWN}</div>
      </div>

      <div>
        <div className={subtitleStyle}>Age</div>
        <div>{DisplayMessages.UNKNOWN}</div>
      </div>
    </div>
  );
}

function MorphImage({ morph }: { morph: NeuronMorphology }) {
  const contentUrl = morph.distribution?.[0]?.contentUrl;

  if (!contentUrl)
    return (
      <div className="flex h-[200px] w-[200px] justify-center align-middle">Morphology IMG</div>
    );

  return (
    <div className="border border-black">
      <PreviewThumbnail
        contentUrl={contentUrl}
        dpi={300}
        height={200}
        type={DataType.ExperimentalNeuronMorphology}
        width={200}
      />
    </div>
  );
}
