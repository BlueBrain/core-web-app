import { useEffect, useState } from 'react';
import get from 'lodash/get';

import EModelTracePreview from '@/components/explore-section/ExploreSectionListingView/EModelTracePreview';
import PreviewThumbnail from '@/components/explore-section/ExploreSectionListingView/PreviewThumbnail';
import { DefaultEmptyParam } from '@/components/experiment-designer';
import { DataType } from '@/constants/explore-section/list-views';
import { EModel, NeuronMorphology } from '@/types/e-model';
import { useSessionAtomValue } from '@/hooks/hooks';
import { fetchResourceById } from '@/api/nexus';
import { ensureArray } from '@/util/nexus';

type Props = {
  id: string;
};

const eModelFields = [
  {
    label: 'Examplar morphology',
    value: '',
  },
  {
    label: 'Optimization target',
    value: '',
  },
  {
    label: 'Brain Region',
    value: 'brainLocation.brainRegion.label',
  },
  {
    label: 'E-Type',
    value: 'eType',
  },
];

const mModelFields = [
  {
    label: 'Brain Region',
    value: 'brainLocation.brainRegion.label',
  },
  {
    label: 'Species',
    value: 'subject.species.label',
  },
  {
    label: 'License',
    value: "license['@id']",
    renderer: (value: string) => (
      <a href={value} target="_blank" rel="noopener noreferrer">
        Open 🔗
      </a>
    ),
  },
  {
    label: 'M-Type',
    value: 'mType',
  },
  {
    label: 'Age',
    value: '',
  },
];

function LoadingModel() {
  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-sm">
      <div className="flex animate-pulse flex-col items-start gap-2">
        <div className="mb-4 h-8 w-1/3 rounded bg-gray-300" />
        <div className="flex w-full items-start">
          <div className="mr-4 h-48 w-1/3 rounded bg-gray-300" />
          <div className="flex w-2/3 flex-col gap-4">
            <div className="flex flex-col gap-3">
              <div className="h-2 w-1/4 rounded bg-gray-300" />
              <div className="h-8 w-2/3 rounded bg-gray-300" />
            </div>
            <div className="mt-4 grid w-full grid-cols-2 gap-x-8 gap-y-3">
              {new Array(4).fill('').map((v) => (
                <div key={`sk-${v}`} className="">
                  <div className="mb-4 h-2 w-1/3 rounded bg-gray-300" />
                  <div className="mb-4 h-8 w-full rounded bg-gray-300" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EModelSummary({ id }: Props) {
  const session = useSessionAtomValue();
  const [loadingModel, setLoadingModel] = useState(false);
  const [eModel, updateEModel] = useState<EModel | null>(null);

  useEffect(() => {
    (async () => {
      if (!session) return;
      try {
        setLoadingModel(true);
        updateEModel(await fetchResourceById<EModel>(id, session));
      } catch (error) {
        throw Error('Unable to load electrophysiology model data. Please try again');
      } finally {
        setLoadingModel(false);
      }
    })();
  }, [id, session]);

  if (loadingModel) return <LoadingModel />;
  if (!eModel) return null;

  return (
    <div className="flex items-start gap-4 rounded-md border border-gray-200 p-6 shadow-sm">
      <div className="flex w-full flex-col">
        <h1 className="mb-4 text-2xl uppercase text-gray-500">e-model</h1>
        <div className="flex w-full gap-12">
          <div className="w-full max-w-52">
            <EModelTracePreview
              className="border border-neutral-2"
              images={eModel.image}
              height={200}
              width={200}
            />
          </div>
          <div className="flex min-w-0 flex-grow flex-col items-start overflow-x-hidden">
            <div className="mb-4 w-full">
              <p className="lin uppercase text-gray-500">Name</p>
              <h1 className="break-words text-xl font-bold text-primary-8" title={eModel.name}>
                {eModel.name}
              </h1>
            </div>
            <div className="grid w-full grid-cols-2 gap-x-8 gap-y-3 text-primary-8">
              {eModelFields.map(({ label, value }) => (
                <div key={label}>
                  <div className="uppercase text-gray-500">{label}</div>
                  <div className="line-clamp-1">{get(eModel, value, <DefaultEmptyParam />)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MModelSummary({ id }: Props) {
  const session = useSessionAtomValue();
  const [loadingModel, setLoadingModel] = useState(false);
  const [mModel, updateEModel] = useState<NeuronMorphology | null>(null);

  useEffect(() => {
    (async () => {
      if (!session) return;
      try {
        setLoadingModel(true);
        updateEModel(await fetchResourceById<NeuronMorphology>(id, session));
      } catch (error) {
        throw Error('Unable to load neuron-morphology model data. Please try again');
      } finally {
        setLoadingModel(false);
      }
    })();
  }, [id, session]);

  let swcUrl = null;
  if (mModel?.distribution) {
    const distributions = ensureArray(mModel?.distribution);
    swcUrl = distributions.find((o) => o.encodingFormat === 'application/swc')?.contentUrl;
  }

  if (loadingModel) return <LoadingModel />;
  if (!mModel) return null;

  return (
    <div className="flex items-start gap-4 rounded-md border border-gray-200 p-6 shadow-sm">
      <div className="flex w-full flex-col">
        <h1 className="mb-4 text-2xl uppercase text-gray-500">e-model</h1>
        <div className="flex w-full gap-12">
          <div className="w-full max-w-64">
            {swcUrl && (
              <PreviewThumbnail
                contentUrl={swcUrl}
                dpi={300}
                height={250}
                type={DataType.ExperimentalNeuronMorphology}
                width={250}
              />
            )}
          </div>
          <div className="flex min-w-0 flex-grow flex-col items-start overflow-x-hidden">
            <div className="mb-4 w-full">
              <p className="lin uppercase text-gray-500">Name</p>
              <h1 className="break-words text-xl font-bold text-primary-8" title={mModel.name}>
                {mModel.name}
              </h1>
            </div>
            <div className="grid w-full grid-cols-2 gap-x-8 gap-y-3 text-primary-8">
              {mModelFields.map(({ label, value, renderer }) => (
                <div key={label}>
                  <div className="uppercase text-gray-500">{label}</div>
                  {renderer ? (
                    renderer(get(mModel, value, ''))
                  ) : (
                    <div className="line-clamp-1">{get(mModel, value, <DefaultEmptyParam />)}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
