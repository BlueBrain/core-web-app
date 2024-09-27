import { useEffect, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { ColumnsType } from 'antd/es/table';
import { DeleteOutlined } from '@ant-design/icons';

import DefaultEModelTable from './DefaultEModelTable';
import Header from './Header';
import PickMorphology from './PickMorphology';
import ErrorMessageLine, { StandardFallback } from './ErrorMessageLine';

import {
  eModelEditModeAtom,
  eModelUIConfigAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { useUnwrappedValue } from '@/hooks/hooks';
import { ExemplarMorphologyDataType } from '@/types/e-model';
import GenericButton from '@/components/Global/GenericButton';
import { previewRender } from '@/constants/explore-section/fields-config/common';
import { eModelExemplarMorphologyFamily } from '@/state/e-model';
import { detailFamily } from '@/state/explore-section/detail-view-atoms';
import { from64 } from '@/util/common';

import useResourceInfoFromPath from '@/hooks/useResourceInfoFromPath';

const nameRenderFn = (name: string) => <div className="font-bold">{name}</div>;

const defaultColumns: ColumnsType<ExemplarMorphologyDataType> = [
  {
    title: 'NAME',
    dataIndex: 'name',
    key: 'name',
    render: nameRenderFn,
  },
  {
    title: 'DESCRIPTION',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'BRAIN LOCATION',
    dataIndex: 'brainLocation',
    key: 'brainLocation',
  },
  {
    title: 'M-TYPE',
    dataIndex: 'mType',
    key: 'mType',
  },
  {
    title: 'CONTRIBUTOR',
    dataIndex: 'contributor',
    key: 'contributor',
  },
];

type Params = {
  id: string;
  projectId: string;
  virtualLabId: string;
};

export default function ExemplarMorphology({ params }: { params: Params }) {
  const { id } = params;

  const [orgProj] = from64(id).split('!/!');
  const [org, proj] = orgProj.split('/');

  const info = useResourceInfoFromPath();

  const detail = useUnwrappedValue(detailFamily(info));

  const eModelExemplarMorphology = useUnwrappedValue(
    eModelExemplarMorphologyFamily({
      eModelId: detail?.['@id'],
      projectId: proj,
      virtualLabId: org,
    })
  );

  const exemplarMorphology = eModelExemplarMorphology;

  const eModelEditMode = useAtomValue(eModelEditModeAtom);
  const [eModelUIConfig, setEModelUIConfig] = useAtom(eModelUIConfigAtom);
  const [openPicker, setOpenPicker] = useState(false);

  useEffect(() => {
    if (!eModelEditMode || !exemplarMorphology) return;

    setEModelUIConfig((oldAtomData) => ({
      ...oldAtomData,
      morphologies: [structuredClone(exemplarMorphology)],
    }));
  }, [eModelEditMode, exemplarMorphology, setEModelUIConfig]);

  const onMorphologyDelete = (morphology: ExemplarMorphologyDataType) => {
    setEModelUIConfig((oldAtomData) => {
      if (!oldAtomData?.morphologies) return oldAtomData;

      const results = oldAtomData.morphologies.filter(
        (morph) => morph['@id'] !== morphology['@id']
      );

      return {
        ...oldAtomData,
        morphologies: results,
      };
    });
  };

  const exemplarMorphologyAsList = exemplarMorphology ? [exemplarMorphology] : [];
  const morphologies = eModelEditMode ? eModelUIConfig?.morphologies : exemplarMorphologyAsList;

  const deleteColumn = {
    title: '',
    key: 'action',
    render: (morphology: ExemplarMorphologyDataType) => (
      <button type="button" onClick={() => onMorphologyDelete(morphology)} aria-label="Delete">
        <DeleteOutlined />
      </button>
    ),
  };

  const previewColumn = {
    title: 'PREVIEW',
    key: 'preview',
    width: 200,
    render: (morphology: ExemplarMorphologyDataType) => previewRender(morphology),
  };

  const columns = [previewColumn, ...defaultColumns, ...(eModelEditMode ? [deleteColumn] : [])];

  let displayMorphologyError = null;

  const title = 'Exemplar morphology';

  if (!morphologies) {
    return <StandardFallback type="error">{title}</StandardFallback>;
  }

  if (exemplarMorphologyAsList.length > 0 && morphologies && morphologies.length !== 1) {
    if (morphologies.length > 1) {
      displayMorphologyError = 'Too many morphologies selected. Keep only one.';
    } else {
      displayMorphologyError = 'Select at least one morphology';
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Header>{title}</Header>

      <DefaultEModelTable<ExemplarMorphologyDataType>
        dataSource={morphologies || []}
        columns={columns}
      />

      <ErrorMessageLine message={displayMorphologyError} />

      {eModelEditMode && (
        <>
          <GenericButton
            className="mt-2 border-primary-7 text-primary-7"
            text="Assign morphology"
            onClick={() => {
              setOpenPicker(true);
            }}
          />
          <PickMorphology
            isOpen={openPicker}
            onCancel={() => setOpenPicker(false)}
            onOk={() => setOpenPicker(false)}
          />
        </>
      )}
    </div>
  );
}
