import { Skeleton } from 'antd';
import Link from 'next/link';

import CardVisualization from '@/components/explore-section/CardView/CardVisualization';

import { EModelThumbnail } from '@/components/build-section/virtual-lab/me-model/EModelCard';
import { DataType } from '@/constants/explore-section/list-views';
import { MEModel, MEModelResource } from '@/types/me-model';
import { EModel, NeuronMorphology } from '@/types/e-model';
import { DisplayMessages } from '@/constants/display-messages';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import { to64 } from '@/util/common';
import { getOrgAndProjectFromProjectId } from '@/util/nexus';

export function MEModelConfiguration({
  meModel,
  mModel,
  eModel,
  virtualLabId,
  projectId,
}: {
  meModel: MEModelResource;
  mModel: NeuronMorphology;
  eModel: EModel;
  virtualLabId: string;
  projectId: string;
}) {
  const generateMeModelDetailView = () => {
    const vlProjectUrl = generateVlProjectUrl(virtualLabId, projectId);
    const baseBuildUrl = `${vlProjectUrl}/build/me-model/view`;
    const { org, project } = getOrgAndProjectFromProjectId(meModel._project);
    return `${baseBuildUrl}/${to64(`${org}/${project}!/!${meModel['@id']}`)}`;
  };

  return (
    <div className="relative mt-2 flex gap-10 rounded-md border border-gray-400 p-4">
      <Link
        href={generateMeModelDetailView()}
        className="absolute right-4 top-4 font-bold text-primary-8"
      >
        View details
      </Link>
      <div className="flex flex-col justify-center gap-2">
        <div className="mb-2 text-2xl font-light uppercase text-gray-400">single neuron model</div>
        <div className="flex items-start gap-2">
          <CardVisualization
            dataType={DataType.ExperimentalNeuronMorphology}
            resource={mModel}
            height={200}
            width={200}
          />
          {eModel ? (
            <EModelThumbnail emodel={eModel} />
          ) : (
            <Skeleton.Image className="h-full w-full rounded-none" />
          )}
        </div>
      </div>
      <div className="mt-12 flex-grow">
        <div className="font-thin uppercase text-slate-600">NAME</div>
        <div className="my-1 text-3xl font-bold text-primary-8">{meModel.name}</div>
        <MeModelDetails meModel={meModel} eModel={eModel} mModel={mModel} />
      </div>
    </div>
  );
}

type ModelDetails = {
  meModel: MEModel;
  eModel: EModel;
  mModel: NeuronMorphology;
};

function MeModelDetails({ meModel, eModel, mModel }: ModelDetails) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 text-primary-8">
      <div className="col-span-1">
        <div className="font-thin uppercase text-slate-600">m-model</div>
        <div className="line-clamp-1">{mModel.name || DisplayMessages.NO_DATA_STRING}</div>
      </div>
      <div className="col-span-1">
        <div className="font-thin uppercase text-slate-600">e-model</div>
        <div className="line-clamp-1">{eModel.name || DisplayMessages.NO_DATA_STRING}</div>
      </div>
      <div className="col-span-1">
        <div className="font-thin uppercase text-slate-600">Brain Region</div>
        <div className="line-clamp-1">
          {meModel.brainLocation?.brainRegion?.label || DisplayMessages.NO_DATA_STRING}
        </div>
      </div>
      <div className="col-span-1">
        <div className="font-thin uppercase text-slate-600">E-Type</div>
        <div className="line-clamp-1">{eModel.eType || DisplayMessages.NO_DATA_STRING}</div>
      </div>
      <div className="col-span-2">
        <div className="font-thin uppercase text-slate-600">M-Type</div>
        <div className="line-clamp-1">
          {meModel.mType ?? (mModel.mType || DisplayMessages.NO_DATA_STRING)}
        </div>
      </div>
    </div>
  );
}
