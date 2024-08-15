import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useState } from 'react';
import { useAtom } from 'jotai';
import delay from 'lodash/delay';

import { sendDisplaySynapses3DEvent, sendRemoveSynapses3DEvent } from './events';
import {
  SectionSynapses,
  synapsesPlacementAtom,
  SynapseTypeColorMap,
  SynapseTypeColorMapKey,
} from '@/state/synaptome';
import { SingleSynaptomeConfig } from '@/types/synaptome';
import { getSynaptomePlacement } from '@/api/bluenaas';
import { createBubblesInstanced } from '@/services/bluenaas-single-cell/renderer-utils';
import { getSession } from '@/authFetch';

type Props = {
  config: SingleSynaptomeConfig;
  modelSelf: string;
  seed: number;
  onSuccess: () => void;
  onError: () => void;
  disable: boolean;
  id: string;
};

export default function VisualizeSynaptomeButton({
  config,
  modelSelf,
  seed,
  disable,
  onSuccess,
  onError,
  id,
}: Props) {
  const [synapseVis, setSynapseVis] = useState(false);
  const [visualizeLoading, setLoadingVisualize] = useState(false);
  const [synapsesPlacement, setSynapsesPlacementAtom] = useAtom(synapsesPlacementAtom);

  const onHideSynapse = () => {
    setSynapseVis(false);
    const currentSynapsesPlacementConfig = synapsesPlacement?.[id];
    if (currentSynapsesPlacementConfig && currentSynapsesPlacementConfig.meshId) {
      sendRemoveSynapses3DEvent(id, currentSynapsesPlacementConfig.meshId);
      setSynapsesPlacementAtom({
        ...synapsesPlacement,
        [id]: {
          ...currentSynapsesPlacementConfig,
          count: undefined,
          meshId: undefined,
        },
      });
    }
  };

  const onVisualize = async () => {
    setLoadingVisualize(true);
    onHideSynapse();

    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error('User should be logged in');
      }
      const response = await getSynaptomePlacement({
        modelId: modelSelf,
        seed,
        config,
        token: session?.accessToken,
      });
      if (!response.ok) {
        return delay(() => onError(), 2000);
      }

      const result: { synapses: Array<SectionSynapses> } = await response.json();

      const synapsePositions = result.synapses
        .flat()
        .flatMap((p) => p.synapses)
        .map((o) => o.coordinates);

      const mesh = createBubblesInstanced(
        synapsePositions,
        config.type ? SynapseTypeColorMap[config.type as SynapseTypeColorMapKey] : undefined
      );

      sendDisplaySynapses3DEvent(id, mesh);

      setSynapsesPlacementAtom({
        ...synapsesPlacement,
        [id]: {
          sectionSynapses: result.synapses,
          count: synapsePositions.length,
          meshId: mesh.uuid,
        },
      });
      setSynapseVis(true);
      return delay(() => onSuccess(), 2000);
    } catch (error) {
      return delay(() => onError(), 2000);
    } finally {
      setLoadingVisualize(false);
    }
  };
  return (
    <>
      <Button
        type="default"
        htmlType="button"
        icon={<EyeOutlined />}
        onClick={onVisualize}
        disabled={visualizeLoading || disable}
        loading={visualizeLoading}
        title="Show synapses"
      />
      {synapseVis && (
        <Button
          type="default"
          icon={<EyeInvisibleOutlined />}
          onClick={onHideSynapse}
          title="Hide synapses"
        />
      )}
    </>
  );
}
