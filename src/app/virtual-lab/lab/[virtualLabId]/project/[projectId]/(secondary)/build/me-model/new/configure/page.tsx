'use client';

import { useState } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { notification, Spin } from 'antd';
import { useRouter } from 'next/navigation';

import MorphologyCard from '@/components/build-section/virtual-lab/me-model/MorphologyCard';
import EModelCard from '@/components/build-section/virtual-lab/me-model/EModelCard';
// import { usePendingValidationModal } from '@/components/build-section/virtual-lab/me-model/pending-validation-modal-hook';
import { createMEModelAtom, meModelDetailsAtom } from '@/state/virtual-lab/build/me-model-setter';
import {
  selectedEModelAtom,
  selectedEModelConfigurationAtom,
  selectedMModelAtom,
} from '@/state/virtual-lab/build/me-model';
import { virtualLabProjectUsersAtomFamily } from '@/state/virtual-lab/projects';
import { classNames } from '@/util/utils';
import { detailUrlWithinLab } from '@/util/common';
import { BookmarkTabsName } from '@/types/virtual-lab/bookmark';
import { ModelTypeNames } from '@/constants/explore-section/data-types/model-data-types';
import { DisplayMessages } from '@/constants/display-messages';
import { ensureArray } from '@/util/nexus';

type Params = {
  params: {
    virtualLabId: string;
    projectId: string;
  };
};

function NewMEModelHeader({ projectId, virtualLabId }: Params['params']) {
  const contributors = useAtomValue(virtualLabProjectUsersAtomFamily({ projectId, virtualLabId }));
  const selectedMModel = useAtomValue(selectedMModelAtom);
  const selectedEModel = useAtomValue(selectedEModelAtom);

  const meModelDetails = useAtomValue(meModelDetailsAtom);

  const router = useRouter();

  if (meModelDetails === null) {
    router.push('./'); // Redirects to (...)/build/me-model/new

    return undefined;
  }

  const fields = [
    {
      className: 'col-span-6',
      title: 'name',
      value: <span className="text-2xl font-bold">{meModelDetails.name}</span>,
    },
    {
      className: 'col-span-3 row-span-3',
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
    {
      title: 'm-type',
      value:
        ensureArray(selectedMModel?.annotation)?.find(({ '@type': type }) =>
          type.includes('MTypeAnnotation')
        )?.hasBody.label || DisplayMessages.NO_DATA_STRING,
    },
    {
      title: 'e-type',
      value:
        ensureArray(selectedEModel?.annotation)?.find(({ '@type': type }) =>
          type.includes('ETypeAnnotation')
        )?.hasBody.label || DisplayMessages.NO_DATA_STRING,
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
  const router = useRouter();
  const selectedMModel = useAtomValue(selectedMModelAtom);
  const selectedEModel = useAtomValue(selectedEModelAtom);
  const selectedEModelConfiguration = useAtomValue(selectedEModelConfigurationAtom);
  const createMEModel = useSetAtom(createMEModelAtom);
  const [meModelCreating, setMeModelCreating] = useState<boolean>(false);

  // const { contextHolder, createModal } = usePendingValidationModal();

  const modelsAreSelected = selectedEModel && selectedMModel;

  // const onClickWithValidation = () => {
  //   createMEModel({ virtualLabId, projectId });
  //   createModal({ virtualLabId, projectId });
  // };

  const onClickWithoutValidation = () => {
    setMeModelCreating(true);

    createMEModel({ virtualLabId, projectId })
      .then((meModel) => {
        if (!meModel) return;
        const redirectionUrl = detailUrlWithinLab(
          virtualLabId,
          projectId,
          `${virtualLabId}/${projectId}`,
          meModel['@id'],
          BookmarkTabsName.MODELS,
          ModelTypeNames.ME_MODEL
        );
        notification.success({
          message: 'ME-model created successfully',
        });
        setMeModelCreating(false);
        router.push(redirectionUrl);
      })
      .catch(() => {
        setMeModelCreating(false);
      });
  };

  const validateTrigger = modelsAreSelected && (
    <div className="absolute bottom-10 right-10 flex flex-row gap-4 text-white">
      <button
        className={classNames(
          'fit-content fixed bottom-10 right-10 ml-auto flex w-fit min-w-40 items-center justify-center p-4 font-bold hover:brightness-110',
          meModelCreating ? 'bg-neutral-4' : 'bg-primary-8'
        )}
        onClick={onClickWithoutValidation}
        type="button"
        disabled={meModelCreating}
      >
        {meModelCreating ? (
          <span className="flex flex-row gap-4">
            Creating ME-model <Spin />
          </span>
        ) : (
          'Save'
        )}
      </button>
      {/* Hiding for Sfn */}
      {/* <button
        className="fit-content ml-auto flex w-fit items-center bg-primary-8 p-4 font-bold hover:brightness-110"
        onClick={onClickWithValidation}
        type="button"
      >
        Launch validation
      </button> */}
    </div>
  );

  return (
    <>
      <div className="m-10 flex flex-col gap-8">
        <NewMEModelHeader projectId={projectId} virtualLabId={virtualLabId} />
        <div className="flex flex-col gap-4">
          <MorphologyCard reselectLink />
          <EModelCard
            exemplarMorphology={
              selectedEModelConfiguration?.uses.find(
                ({ '@type': type }) => type === 'NeuronMorphology'
              )?.name
            }
            reselectLink
          />
        </div>
      </div>
      {validateTrigger}
      {/* {contextHolder} */}
    </>
  );
}
