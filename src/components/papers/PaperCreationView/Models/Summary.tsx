import { Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

import { EModelSummary, MModelSummary } from './PerTypeSummary';
import { MEModelResource } from '@/types/me-model';

type Props = {
  model: MEModelResource;
  onClose: () => void;
};

export default function ModelSummary({ model, onClose }: Props) {
  const type = model['@type'];
  const eModelId =
    model.hasPart?.find((r) => r['@type'] === 'EModel')?.['@id'] ??
    (type.includes('EModel') ? model['@id'] : undefined);
  const mModelId =
    model.hasPart?.find((r) => r['@type'] === 'NeuronMorphology')?.['@id'] ??
    (type.includes('NeuronMorphology') ? model['@id'] : undefined);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="mb-2  flex w-full items-center justify-between">
        <h1 className="break-words text-2xl font-bold text-primary-8">{model.name}</h1>
        <Button
          icon={<CloseOutlined className="text-primary-8" />}
          type="text"
          htmlType="button"
          onClick={onClose}
        />
      </div>
      {eModelId && <EModelSummary {...{ id: eModelId }} />}
      {mModelId && <MModelSummary {...{ id: mModelId }} />}
    </div>
  );
}
