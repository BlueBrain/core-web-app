'use client';

import { useCallback, useState } from 'react';
import { Form, Button, Space, InputNumber } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useAtom, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import sample from 'lodash/sample';
import SynapseSet from './SynapseSet';
import {
  CREATE_SYNAPTOME_CONFIG_FAIL,
  CREATE_SYNAPTOME_FAIL,
  CREATE_SYNAPTOME_SUCCESS,
  DEFAULT_SYNAPSE_VALUE,
  CONFIG_FILE_NAME,
  CREATE_SYNAPTOME_WARNING,
} from './constants';
import { classNames, createHeaders, getRandomIntInclusive } from '@/util/utils';
import { composeUrl, createDistribution } from '@/util/nexus';
import {
  NEXUS_SYNAPTOME_TYPE,
  SingleSynaptomeConfig,
  SYNAPTOME_OBJECT_OF_STUDY,
  SynaptomeModelConfiguration,
} from '@/types/synaptome';
import { getSession } from '@/authFetch';
import { synapsesPlacementAtom } from '@/state/synaptome';
import { MEModelResource } from '@/types/me-model';
import {
  sendRemoveSynapses3DEvent,
  sendResetSynapses3DEvent,
} from '@/components/neuron-viewer/hooks/events';
import useNotification from '@/hooks/notifications';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import { queryAtom, selectedRowsAtom } from '@/state/explore-section/list-view-atoms';
import { selectedSimulationScopeAtom } from '@/state/simulate';
import { SimulationType } from '@/types/virtual-lab/lab';
import { DataType } from '@/constants/explore-section/list-views';
import { ExploreDataScope } from '@/types/explore-section/application';
import { to64 } from '@/util/common';
import { Entity } from '@/types/nexus';
import { useSessionStorage } from '@/hooks/useSessionStorage';
import { ExploreESHit, ExploreResource } from '@/types/explore-section/es';
import { SIMULATION_COLORS } from '@/constants/simulate/single-neuron';

const label = (text: string) => (
  <span className="text-base font-semibold text-primary-8">{text}</span>
);

type Props = {
  resource: MEModelResource;
  org: string;
  project: string;
};

export default function SynaptomeConfigurationForm({ org, project, resource }: Props) {
  const { push: navigate } = useRouter();
  const [loading, setLoading] = useState(false);
  const { error: notifyError, success: notifySuccess, warning: notifyWarning } = useNotification();
  const form = Form.useFormInstance<SynaptomeModelConfiguration>();
  const seed = Form.useWatch<number>('seed', form);
  const [synapsesPlacement, setSynapsesPlacementAtom] = useAtom(synapsesPlacementAtom);
  const { removeSessionValue } = useSessionStorage<{
    name: string;
    description: string;
    basePath: string;
    record: ExploreESHit<ExploreResource>;
    selectedRows: Array<ExploreESHit<ExploreResource>> | null;
  } | null>(`me-model/${org}/${project}`, null);

  const setSimulationScope = useSetAtom(selectedSimulationScopeAtom);
  const refreshSynaptomeModels = useSetAtom(
    queryAtom({
      dataType: DataType.SingleNeuronSynaptome,
      dataScope: ExploreDataScope.NoScope,
      virtualLabInfo: { virtualLabId: org, projectId: project },
    })
  );

  const generateSynaptomeUrl = (newSynaptome: Entity) => {
    const vlProjectUrl = generateVlProjectUrl(org, project);
    const baseBuildUrl = `${vlProjectUrl}/explore/interactive/model/synaptome`;
    return `${baseBuildUrl}/${to64(`${org}/${project}!/!${newSynaptome['@id']}`)}`;
  };

  const addNewSynapse = useCallback(() => {
    const synapses = form.getFieldValue('synapses');
    const id = crypto.randomUUID();
    setSynapsesPlacementAtom({
      ...synapsesPlacement,
      [id]: null,
    });

    form.setFieldValue('synapses', [
      ...(synapses ?? []),
      {
        ...DEFAULT_SYNAPSE_VALUE,
        id,
        seed: seed + getRandomIntInclusive(0, seed),
        color: sample(SIMULATION_COLORS) ?? SIMULATION_COLORS[synapses.length],
      },
    ]);
  }, [form, seed, synapsesPlacement, setSynapsesPlacementAtom]);

  const onSeedChange = useCallback(
    (value: number | null) => {
      if (value) {
        const formSynapses = form.getFieldValue('synapses');
        form.setFieldsValue({
          ...form.getFieldsValue(),
          seed: value,
          synapses: formSynapses.map((c: SingleSynaptomeConfig) => ({
            ...c,
            seed: value + getRandomIntInclusive(0, value),
          })),
        });
        formSynapses.forEach((c: SingleSynaptomeConfig) => {
          const mesh = synapsesPlacement?.[c.id]?.meshId;
          if (mesh) {
            sendRemoveSynapses3DEvent(c.id, mesh);
          }
        });
      }
    },
    [form, synapsesPlacement]
  );

  const onConfigurationSubmission = async () => {
    try {
      await form.validateFields({ recursive: true });
    } catch (error) {
      if (
        !(
          'errorFields' in (error as { errorFields: any[] }) &&
          !(error as { errorFields: any[] }).errorFields.length
        )
      ) {
        return false;
      }
    }
    const values = form.getFieldsValue();

    try {
      setLoading(true);
      const session = await getSession();
      if (!session) return;

      const configFileUrl = composeUrl('file', '', { org, project });
      const SYNAPTOME_CONFIG = { synapses: values.synapses, meModelSelf: resource._self };

      const formData = new FormData();
      const dataBlob = new Blob([JSON.stringify(SYNAPTOME_CONFIG)], { type: 'application/json' });

      formData.append('file', dataBlob, CONFIG_FILE_NAME);

      const configResponse = await fetch(configFileUrl, {
        method: 'POST',
        headers: createHeaders(session.accessToken, {
          'x-nxs-file-content-length': dataBlob.size.toString(),
        }),
        body: formData,
      });

      if (!configResponse.ok) {
        return notifyError(
          CREATE_SYNAPTOME_CONFIG_FAIL,
          undefined,
          'topRight',
          undefined,
          'synaptome-config'
        );
      }

      const fileMetadata = await configResponse.json();
      const resourceUrl = composeUrl('resource', '', {
        org,
        project,
        sync: true,
        schema: null,
      });

      const sanitizedResource = {
        '@context': 'https://bbp.neuroshapes.org',
        '@type': NEXUS_SYNAPTOME_TYPE,
        objectOfStudy: SYNAPTOME_OBJECT_OF_STUDY,
        name: values.name,
        description: values.description,
        seed: values.seed,
        distribution: [createDistribution(fileMetadata, fileMetadata._self)],
        memodel: resource['@id'],
        used: {
          '@id': resource['@id'],
          '@type': resource['@type'],
          name: resource.name,
        },
        brainLocation: resource.brainLocation,
      };

      const resp = await fetch(resourceUrl, {
        method: 'POST',
        headers: createHeaders(session.accessToken),
        body: JSON.stringify(sanitizedResource),
      });

      const newSynaptomeModel: Entity = await resp.json();

      refreshSynaptomeModels();

      if (!resp.ok) {
        return notifyError(
          CREATE_SYNAPTOME_FAIL,
          undefined,
          'topRight',
          undefined,
          'synaptome-config'
        );
      }

      form.resetFields();
      setSimulationScope(SimulationType.Synaptome);
      selectedRowsAtom.setShouldRemove(() => true); // set function to remove all
      selectedRowsAtom.setShouldRemove(null); // clear function
      sendResetSynapses3DEvent();
      notifyWarning(CREATE_SYNAPTOME_WARNING, 6, 'topRight', undefined, newSynaptomeModel['@id']);
      notifySuccess(CREATE_SYNAPTOME_SUCCESS, undefined, 'topRight');
      removeSessionValue();
      setLoading(false);

      navigate(generateSynaptomeUrl(newSynaptomeModel));
    } catch (error) {
      notifyError(CREATE_SYNAPTOME_FAIL, undefined, 'topRight', undefined, 'synaptome-config');
      setLoading(false);
    }
  };

  return (
    <div className="relative mb-20 h-full w-full">
      <div className="sticky top-0 mb-5 flex items-center justify-between gap-2">
        <h2 className="my-3 text-2xl font-bold text-primary-8">
          <span>
            Synapses sets
            <span className="ml-2 text-base font-light">
              {form.getFieldValue('synapses')?.length
                ? `(${form.getFieldValue('synapses').length})`
                : ''}
            </span>
          </span>
        </h2>
        <Form.Item name="seed" rules={[{ required: true, message: 'Please provide a seed!' }]}>
          <div className="flex items-center gap-2">
            {label('Seed')}
            <InputNumber
              name="seed"
              placeholder="Enter a seed "
              className="w-24 max-w-fit"
              size="large"
              onChange={onSeedChange}
              value={form.getFieldValue('seed')}
            />
          </div>
        </Form.Item>
      </div>
      <div className="secondary-scrollbar mb-2 h-full max-h-[calc(100vh-255px)] overflow-y-auto pr-4">
        <Form.List name="synapses" initialValue={['name', 'formula']}>
          {(fields, { remove: removeGroup }) => {
            return fields.map((field, index) => {
              return (
                <SynapseSet
                  key={field.key}
                  {...{
                    field,
                    index,
                    removeGroup,
                    modelId: resource._self,
                  }}
                />
              );
            });
          }}
        </Form.List>
        <Button
          htmlType="button"
          aria-label="Add Synapse"
          onClick={addNewSynapse}
          className="border-primary-8 text-primary-8"
          size="large"
        >
          Add new synapses set
        </Button>
      </div>
      <Form.Item className="fixed bottom-4 right-10 my-6">
        <Space className="w-full justify-end">
          <button
            type="submit"
            className={classNames(
              'flex items-center justify-between gap-2 bg-primary-8 px-12 py-4 text-white',
              'disabled:bg-gray-100 disabled:text-primary-8'
            )}
            disabled={loading}
            onClick={onConfigurationSubmission}
          >
            {loading && <LoadingOutlined />}
            <span className="text-lg font-bold">{loading ? 'Saving ...' : 'Save'}</span>
          </button>
        </Space>
      </Form.Item>
    </div>
  );
}
