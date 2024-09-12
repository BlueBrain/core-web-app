import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import {
  DataType,
  DataTypeToNewSimulationPage,
  DataTypeToNexusType,
} from '@/constants/explore-section/list-views';
import { currentInjectionSimulationConfigAtom } from '@/state/simulate/categories/current-injection-simulation';
import { recordingSourceForSimulationAtom } from '@/state/simulate/categories/recording-source-for-simulation';
import { simulationExperimentalSetupAtom } from '@/state/simulate/categories/simulation-conditions';
import { synaptomeSimulationConfigAtom } from '@/state/simulate/categories/synaptome-simulation-config';
import { SimulationPayload } from '@/types/simulation/single-neuron';
import { to64 } from '@/util/common';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';

type Props = {
  simulationConfig: SimulationPayload;
  virtualLabId: string;
  projectId: string;
  synaptomeModelId: string;
};

export default function CloneSimulationButton({
  virtualLabId,
  projectId,
  simulationConfig,
  synaptomeModelId,
}: Props) {
  const router = useRouter();

  const setRecordFromConfig = useSetAtom(recordingSourceForSimulationAtom);
  const setCurrentInjectionConfig = useSetAtom(currentInjectionSimulationConfigAtom);
  const setSynaptomeConfig = useSetAtom(synaptomeSimulationConfigAtom);
  const setConditionsConfig = useSetAtom(simulationExperimentalSetupAtom);

  const onCloneSimulation = () => {
    setRecordFromConfig(simulationConfig.config.recordFrom);
    setCurrentInjectionConfig([simulationConfig.config.currentInjection]);
    setSynaptomeConfig([...simulationConfig.config.synaptome!]);
    setConditionsConfig(simulationConfig.config.conditions);

    const vlProjectUrl = generateVlProjectUrl(virtualLabId, projectId);
    const baseSimulateUrl = `${vlProjectUrl}/simulate/${DataTypeToNewSimulationPage[DataTypeToNexusType[DataType.SingleNeuronSynaptome]]}/new`;

    const projectLabel = `${virtualLabId}/${projectId}`;
    router.push(`${baseSimulateUrl}/${to64(`${projectLabel}!/!${synaptomeModelId}`)}?mode=clone`);
  };

  return (
    <Button
      type="text"
      className="flex items-center gap-2 text-primary-7 hover:!bg-transparent"
      onClick={onCloneSimulation}
    >
      Clone simulation configuration
      <PlusOutlined className="border border-neutral-2 px-4 py-3" />
    </Button>
  );
}
