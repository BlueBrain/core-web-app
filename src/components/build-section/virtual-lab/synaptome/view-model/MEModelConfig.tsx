import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import { DataType } from '@/constants/explore-section/list-views';
import { useModel } from '@/hooks/useModel';
import { MEModel } from '@/types/me-model';
import { NeuronMorphology } from '@/types/e-model';
import { DisplayMessages } from '@/constants/display-messages';

import CardVisualization from '@/components/explore-section/CardView/CardVisualization';

export function MEModelConfiguration({
  meModelId,
  virtualLabId,
  projectId,
}: {
  meModelId: string;
  virtualLabId: string;
  projectId: string;
}) {
  const { loading: loadingMeModel, resource: meModel } = useModel<MEModel>({
    org: virtualLabId,
    project: projectId,
    modelId: meModelId,
  });

  const { loading: loadingMModel, resource: mModel } = useModel<NeuronMorphology>({
    org: virtualLabId,
    project: projectId,
    modelId: meModel?.hasPart.find((p) => p['@type'] === 'NeuronMorphology')?.['@id']!,
  });

  if (loadingMeModel || loadingMModel || !meModel || !mModel) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
        <Spin indicator={<LoadingOutlined />} size="large" />
        <h2 className="font-light text-primary-9">Loading ME model...</h2>
      </div>
    );
  }

  return (
    <div className="mt-2 flex gap-10 rounded-md border border-gray-400 p-4">
      <div className="flex flex-col justify-center gap-2">
        <div className="mb-2 text-2xl font-light uppercase text-gray-400">ME-Model</div>
        <div className="border border-gray-400">
          <CardVisualization
            dataType={DataType.ExperimentalNeuronMorphology}
            resource={mModel}
            height={200}
            width={200}
          />
        </div>
      </div>
      <div className="mt-12 flex-grow">
        <div className="font-thin uppercase text-slate-600">NAME</div>
        <div className="my-1 text-3xl font-bold text-primary-8">{meModel.name}</div>
        <MeModelDetails model={meModel} />
      </div>
    </div>
  );
}

function MeModelDetails({ model }: { model: MEModel }) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4 text-primary-8">
      <div className="col-span-1">
        <div className="font-thin uppercase text-slate-600">Brain Region</div>
        <div>{model.brainLocation?.brainRegion?.label || DisplayMessages.NO_DATA_STRING}</div>
      </div>
      <div className="col-span-1">
        <div className="font-thin uppercase text-slate-600">Species</div>
        <div>{model.subject?.species?.label || DisplayMessages.NO_DATA_STRING}</div>
      </div>
      <div className="col-span-2">
        <div className="font-thin uppercase text-slate-600">M-Type</div>
        <div>{model.mType || DisplayMessages.NO_DATA_STRING}</div>
      </div>
      <div className="col-span-2">
        <div className="font-thin uppercase text-slate-600">E-Type</div>
        <div>{model.eType || DisplayMessages.NO_DATA_STRING}</div>
      </div>
    </div>
  );
}
