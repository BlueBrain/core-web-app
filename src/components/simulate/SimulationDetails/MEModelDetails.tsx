import Link from 'next/link';
import { Skeleton } from 'antd';

import { EModelThumbnail } from '@/components/build-section/virtual-lab/me-model/EModelCard';
import { DisplayMessages } from '@/constants/display-messages';
import { DataType } from '@/constants/explore-section/list-views';
import { EModel, NeuronMorphology } from '@/types/e-model';
import { MEModelResource } from '@/types/me-model';
import { classNames } from '@/util/utils';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import { to64 } from '@/util/common';

import CardVisualization from '@/components/explore-section/CardView/CardVisualization';

type Props = {
  name: string;
  type: 'single-neuron-simulation' | 'synaptome-simulation';
  virtualLabId: string;
  projectId: string;
  meModel: MEModelResource;
  mModel: NeuronMorphology;
  eModel: EModel;
};

function Field({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="mb-4 mr-10 text-sm text-primary-7">
      <div className="uppercase text-neutral-4">{label}</div>
      <div className={classNames(className)}>{value}</div>
    </div>
  );
}

export default function ModelDetails({
  name,
  type,
  virtualLabId,
  projectId,
  meModel,
  mModel,
  eModel,
}: Props) {
  const generateMeModelDetailView = () => {
    const vlProjectUrl = generateVlProjectUrl(virtualLabId, projectId);
    const baseExploreUrl = `${vlProjectUrl}/explore/interactive/model/me-model`;
    return `${baseExploreUrl}/${to64(`${virtualLabId}/${projectId}!/!${meModel['@id']}`)}`;
  };

  return (
    <div>
      <h1 className="mb-3 text-3xl font-bold text-primary-8">Model</h1>
      <div className="relative flex max-h-fit items-start gap-4 rounded border border-neutral-200 px-8 py-6">
        <Link
          href={generateMeModelDetailView()}
          className="absolute right-8 top-6 flex items-center justify-center font-bold text-primary-8 hover:text-primary-7"
        >
          View details
        </Link>
        <div className="flex flex-col">
          <span className="mb-2 text-base uppercase text-neutral-4">
            {type === 'single-neuron-simulation' ? 'Single neuron model' : 'Synaptome'}
          </span>
          <div className="flex items-start gap-2">
            {mModel ? (
              <div className="flex h-56 w-56 items-center justify-center border border-neutral-3">
                <CardVisualization
                  dataType={DataType.ExperimentalNeuronMorphology}
                  resource={mModel}
                  height={200}
                  width={200}
                />
              </div>
            ) : (
              <Skeleton.Image className="h-full w-full rounded-none" />
            )}
            {eModel ? (
              <div className="flex h-56 w-56 items-center justify-center border border-neutral-3">
                <EModelThumbnail emodel={eModel} />
              </div>
            ) : (
              <Skeleton.Image className="h-full w-full rounded-none" />
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <div className="pl-12">
            <Field label="Name" value={name} className="my-1 text-3xl font-bold text-primary-8" />
          </div>
          <div className="flex items-start gap-4 pl-12">
            <div className="flex flex-col gap-2">
              {type === 'synaptome-simulation' && <Field label="ME-Model" value={meModel.name} />}
              {type === 'single-neuron-simulation' && <Field label="M-Model" value={mModel.name} />}
              <Field label="Brain Region" value={meModel.brainLocation?.brainRegion.label ?? ''} />
              {type === 'single-neuron-simulation' && (
                <Field
                  label="M-Type"
                  value={meModel.mType ?? mModel.mType ?? DisplayMessages.NO_DATA_STRING}
                />
              )}
            </div>
            <div className="flex flex-col gap-2">
              {type === 'single-neuron-simulation' && (
                <Field
                  label="E-Model"
                  value={meModel.eModel ?? eModel.eModel ?? DisplayMessages.NO_DATA_STRING}
                />
              )}
              {type === 'synaptome-simulation' && (
                <Field
                  label="M-Type"
                  value={meModel.mType ?? mModel.mType ?? DisplayMessages.NO_DATA_STRING}
                />
              )}
              <Field
                label="E-Type"
                value={meModel.eType ?? eModel.eType ?? DisplayMessages.NO_DATA_STRING}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
