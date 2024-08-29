'use client';

import { useCallback } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { loadable } from 'jotai/utils';

import MorphologyCard from '@/components/build-section/virtual-lab/me-model/MorphologyCard';
import EModelCard from '@/components/build-section/virtual-lab/me-model/EModelCard';

import { usePendingValidationModal } from '@/components/build-section/virtual-lab/me-model/pending-validation-modal-hook';

import { createMEModelAtom, meModelDetailsAtom } from '@/state/virtual-lab/build/me-model-setter';
import { selectedEModelAtom, selectedMModelAtom } from '@/state/virtual-lab/build/me-model';
import { virtualLabProjectUsersAtomFamily } from '@/state/virtual-lab/projects';
import { VirtualLabInfo } from '@/types/virtual-lab/common';
import { generateVlProjectUrl } from '@/util/virtual-lab/urls';
import { classNames } from '@/util/utils';
import { useLoadable } from '@/hooks/hooks';

type Params = {
  params: {
    virtualLabId: string;
    projectId: string;
  };
};

function NewMEModelHeader({ projectId, virtualLabId }: Params['params']) {
  const contributors = useAtomValue(virtualLabProjectUsersAtomFamily({ projectId, virtualLabId }));

  const meModelDetails = useLoadable<{
    name: string;
    description: string;
    brainRegion?: { id: string; title: string };
  }>(loadable(meModelDetailsAtom), {
    name: '',
    description: '',
  });

  const fields = [
    {
      className: 'col-span-6',
      title: 'name',
      value: <span className="text-2xl font-bold">{meModelDetails.name}</span>,
    },
    {
      className: 'col-span-3',
      title: 'description',
      value: meModelDetails.description,
    },
    {
      title: 'brain region',
      value: meModelDetails.brainRegion?.title,
    },
    {
      title: 'contributors',
      value: <ul>{contributors?.map(({ id, name }) => <li key={id}>{name}</li>)}</ul>,
    },
    {
      title: 'registration date',
      value: new Intl.DateTimeFormat('fr-CH').format(new Date()),
    },
  ];

  return (
    <div className="grid max-w-screen-2xl grow grid-cols-6 gap-x-10 gap-y-4 break-words">
      {fields.map(({ className, title, value }) => (
        <div key={title} className={classNames('text-primary-7', className)}>
          <div className="uppercase text-neutral-4">{title}</div>
          <div className="mt-2">{value}</div>
        </div>
      ))}
    </div>
  );
}

export default function NewMEModelPage({ params: { projectId, virtualLabId } }: Params) {
  const selectedMModel = useAtomValue(selectedMModelAtom);
  const selectedEModel = useAtomValue(selectedEModelAtom);
  const createMEModel = useSetAtom(createMEModelAtom);

  const { contextHolder, createModal } = usePendingValidationModal();

  const modelsAreSelected = selectedEModel && selectedMModel;

  const onClick = useCallback(() => {
    const virtualLabInfo: VirtualLabInfo = {
      virtualLabId,
      projectId,
    };

    createMEModel(virtualLabInfo);

    const virtualLabHomeLink = `${generateVlProjectUrl(virtualLabId, projectId)}/home`;

    createModal(virtualLabHomeLink);
  }, [createMEModel, createModal, projectId, virtualLabId]);

  const validateTrigger = modelsAreSelected && (
    <button
      className="fit-content absolute bottom-10 right-10 ml-auto flex w-fit items-center bg-primary-8 p-4 font-bold hover:brightness-110"
      onClick={onClick}
      type="button"
    >
      Launch validation
    </button>
  );

  return (
    <>
      <div className="flex flex-col gap-8">
        <NewMEModelHeader projectId={projectId} virtualLabId={virtualLabId} />
        <div className="flex flex-col gap-4">
          <MorphologyCard />
          <EModelCard />
        </div>
      </div>
      {validateTrigger}
      {contextHolder}
    </>
  );
}
