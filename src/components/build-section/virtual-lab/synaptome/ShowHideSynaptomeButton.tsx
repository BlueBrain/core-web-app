import { useMemo, useRef, useState } from 'react';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useAtom } from 'jotai';
import isEqual from 'lodash/isEqual';

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
import { sendDisplaySynapses3DEvent, sendRemoveSynapses3DEvent } from '@/components/neuron-viewer/events';

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
  const configRef = useRef(config);

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

  const isAlreadyVisualized = useMemo(
    () =>
      !!Object.values(synapsesPlacement ?? []).find(
        (c) =>
          config &&
          c?.synapsePlacementConfigId === config.id &&
          c.meshId &&
          isEqual(config, configRef.current)
      ),
    [config, synapsesPlacement]
  );

  const onVisualize = async () => {
    if (isAlreadyVisualized) {
      return;
    }

    setLoadingVisualize(true);
    onHideSynapse();

    try {
      const session = await getSession();
      if (!session?.accessToken) {
        throw new Error('No session found');
      }
      const response = await getSynaptomePlacement({
        modelId: modelSelf,
        seed,
        config,
        token: session?.accessToken,
      });
      if (!response.ok) {
        return onError();
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
          synapsePlacementConfigId: config.id,
        },
      });
      setSynapseVis(true);
      configRef.current = config;
      return onSuccess();
    } catch (error) {
      return onError();
    } finally {
      setLoadingVisualize(false);
    }
  };
  return (
    <div className="flex items-center gap-2">
      <Button
        type="default"
        htmlType="button"
        icon={<EyeOutlined />}
        onClick={onVisualize}
        disabled={visualizeLoading || isAlreadyVisualized || disable}
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
    </div>
  );
}
