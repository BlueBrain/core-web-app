import { useMemo, useRef, useState } from 'react';
import { EyeInvisibleOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
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
import {
  sendDisplaySynapses3DEvent,
  sendRemoveSynapses3DEvent,
} from '@/components/neuron-viewer/events';
import { classNames } from '@/util/utils';

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
    <div className="flex items-center rounded-xl border-[.5px] border-primary-8">
      <button
        type="button"
        onClick={onVisualize}
        disabled={visualizeLoading || isAlreadyVisualized || disable}
        title="Show synapses"
        className={classNames(
          'cursor-pointer rounded-l-xl',
          visualizeLoading || isAlreadyVisualized || disable ? 'bg-gray-100' : 'bg-primary-8'
        )}
      >
        {visualizeLoading ? (
          <LoadingOutlined className="px-2 text-primary-8" />
        ) : (
          <EyeOutlined
            className={classNames(
              'px-2',
              visualizeLoading || isAlreadyVisualized || disable ? 'text-gray-500' : 'text-white'
            )}
          />
        )}
      </button>
      <button
        type="button"
        aria-label="Hide synapses"
        onClick={onHideSynapse}
        disabled={!synapseVis}
        title="Show synapses"
        className="cursor-pointer rounded-r-xl"
      >
        <EyeInvisibleOutlined
          className={classNames('px-2', synapseVis ? 'text-primary-8' : 'text-gray-500')}
        />
      </button>
    </div>
  );
}
