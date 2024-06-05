import { Divider } from 'antd';
import startCase from 'lodash/startCase';
import { MorphoMetricCompartment } from '@/types/explore-section/es-experiment';
import { sourceMorphoMetricsAtom } from '@/state/explore-section/generalization';

import { DataType } from '@/constants/explore-section/list-views';
import { useMorphometrics } from '@/hooks/useMorphoMetrics';
import { useUnwrappedValue } from '@/hooks/hooks';
import { ExperimentResource } from '@/types/explore-section/delta-experiment';

export default function Morphometrics({
  dataType,
  resource,
}: {
  dataType: DataType;
  resource: ExperimentResource;
}) {
  const metrics = useUnwrappedValue(sourceMorphoMetricsAtom(resource['@id']));

  const { filteredGroupedCardFields, renderMetric } = useMorphometrics(dataType, metrics, true);

  return (
    <div className="flex max-w-screen-2xl flex-col gap-10 pl-2">
      <Divider className="w-full" />
      <h1 className="text-xl font-bold text-primary-8">Morphometrics</h1>
      <div className="grid grid-cols-5 gap-4 break-words">
        {Object.entries(filteredGroupedCardFields).map(([group, fields]) => (
          <div key={group}>
            <h2 className="mb-8 text-lg font-semibold text-primary-8">{startCase(group)}</h2>
            {fields.map((field) => {
              switch (group) {
                case MorphoMetricCompartment.NeuronMorphology:
                  return renderMetric(MorphoMetricCompartment.NeuronMorphology, field);
                case MorphoMetricCompartment.ApicalDendrite:
                  return renderMetric(MorphoMetricCompartment.ApicalDendrite, field);
                case MorphoMetricCompartment.BasalDendrite:
                  return renderMetric(MorphoMetricCompartment.BasalDendrite, field);
                case MorphoMetricCompartment.Axon:
                  return renderMetric(MorphoMetricCompartment.Axon, field);
                case MorphoMetricCompartment.Soma:
                  return renderMetric(MorphoMetricCompartment.Soma, field);
                default:
                  return null;
              }
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
