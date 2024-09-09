import { Skeleton } from 'antd';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { fetchResourceById } from '@/api/nexus';
import { EModelThumbnail } from '@/components/build-section/virtual-lab/me-model/EModelCard';
import CardVisualization from '@/components/explore-section/CardView/CardVisualization';
import { DataType } from '@/constants/explore-section/list-views';
import useNotification from '@/hooks/notifications';

import sessionAtom from '@/state/session';
import { EModel, NeuronMorphology } from '@/types/e-model';
import { NexusMEModel } from '@/types/me-model';
import { classNames } from '@/util/utils';

type Props = {
  meModel: NexusMEModel;
};

function Field({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="mb-4 mr-10 text-sm text-primary-7">
      <div className="uppercase text-neutral-4">{label}</div>
      <div className={classNames(className)}>{value}</div>
    </div>
  );
}

export default function MEModelDetails({ meModel }: Props) {
  const [mModel, setMModel] = useState<NeuronMorphology | null>(null);
  const [eModel, setEModel] = useState<EModel | null>(null);
  const session = useAtomValue(sessionAtom);
  const { error: notifyError } = useNotification();

  useEffect(() => {
    const fetchUsedModels = async () => {
      const usedEModel = meModel.hasPart.find((r) => r['@type'] === 'EModel');
      const usedMModel = meModel.hasPart.find((r) => r['@type'] === 'NeuronMorphology');

      if (!session || !usedEModel || !usedMModel) {
        return;
      }

      const [mModelData, eModelData] = await Promise.all([
        fetchResourceById<NeuronMorphology>(usedMModel['@id'], session),
        fetchResourceById<EModel>(usedEModel['@id'], session),
      ]);
      setMModel(mModelData);
      setEModel(eModelData);
    };

    fetchUsedModels().catch(() => notifyError('Could not fetch data for m-model and e-model'));
  }, [meModel, session, notifyError]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary-8">Model</h1>
      <div className="flex max-h-fit items-center rounded border border-neutral-200 px-8 py-6">
        <div className="flex h-[400px] flex-col">
          <span className="uppercase text-neutral-4">M-Model</span>
          {mModel ? (
            <CardVisualization
              dataType={DataType.ExperimentalNeuronMorphology}
              resource={mModel}
              height={200}
              width={200}
            />
          ) : (
            <Skeleton.Image
              className="!h-full !w-full rounded-none"
              rootClassName="!h-full !w-full"
            />
          )}
          <span className="uppercase text-neutral-4">Trace</span>
          {eModel ? (
            <EModelThumbnail emodel={eModel} />
          ) : (
            <Skeleton.Image
              className="!h-full !w-full rounded-none"
              rootClassName="!h-full !w-full"
            />
          )}
        </div>
        <div className="pl-12">
          <div>
            <Field
              label="Name"
              value={meModel.name}
              className="my-1 text-3xl font-bold text-primary-8"
            />
          </div>

          <div className="mt-8 flex">
            <div>
              <Field label="Single Cell Model" value="—" />
              <Field label="Brain Region" value={meModel.brainLocation?.brainRegion.label ?? ''} />
              <Field label="M Type" value={meModel.mType} />
            </div>
            <div>
              <Field label="E-Model" value={meModel.eModel} />
              <Field label="Examplar Morphology" value="—" />
              <Field label="Optimisation Target" value="—" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
