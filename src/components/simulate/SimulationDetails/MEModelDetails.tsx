import { Skeleton } from 'antd';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { fetchResourceById } from '@/api/nexus';
import { EModelThumbnail } from '@/components/build-section/virtual-lab/me-model/EModelCard';
import { DataType } from '@/constants/explore-section/list-views';
import { EModel, NeuronMorphology } from '@/types/e-model';
import { NexusMEModel } from '@/types/me-model';
import { classNames } from '@/util/utils';

import CardVisualization from '@/components/explore-section/CardView/CardVisualization';
import useNotification from '@/hooks/notifications';
import sessionAtom from '@/state/session';
import { DisplayMessages } from '@/constants/display-messages';

type Props = {
  name: string;
  meModel: NexusMEModel;
  type: 'single-neuron-simulation' | 'synaptome-simulation';
};

function Field({ label, value, className }: { label: string; value: string; className?: string }) {
  return (
    <div className="mb-4 mr-10 text-sm text-primary-7">
      <div className="uppercase text-neutral-4">{label}</div>
      <div className={classNames(className)}>{value}</div>
    </div>
  );
}

export default function ModelDetails({ meModel, name, type }: Props) {
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
      <h1 className="mb-3 text-3xl font-bold text-primary-8">Model</h1>
      <div className="flex max-h-fit items-start gap-4 rounded border border-neutral-200 px-8 py-6">
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
              {type === 'synaptome-simulation' && <Field label="ME Model" value={meModel.name} />}
              <Field label="Brain Region" value={meModel.brainLocation?.brainRegion.label ?? ''} />
              <Field label="M Type" value={meModel.mType ?? DisplayMessages.NO_DATA_STRING} />
            </div>
            <div className="flex flex-col gap-2">
              <Field label="E-Model" value={meModel.eModel ?? DisplayMessages.NO_DATA_STRING} />
              <Field label="E Type" value={meModel.eType ?? DisplayMessages.NO_DATA_STRING} />
            </div>
            {/* <div>
                <Field label="Examplar Morphology" value="—" />
                <Field label="Optimisation Target" value="—" />
              </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
