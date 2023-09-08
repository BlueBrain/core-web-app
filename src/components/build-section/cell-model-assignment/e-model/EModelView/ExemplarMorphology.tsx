import { useEffect, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { ColumnsType } from 'antd/es/table';
import { DeleteOutlined } from '@ant-design/icons';

import DefaultEModelTable from './DefaultEModelTable';
import PickMorphology from './PickMorphology';
import {
  eModelEditModeAtom,
  eModelUIConfigAtom,
  exemplarMorphologyAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { ExemplarMorphologyDataType } from '@/types/e-model';
import GenericButton from '@/components/Global/GenericButton';

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

export default function ExemplarMorphology() {
  const exemplarMorphology = useAtomValue(exemplarMorphologyAtom);
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
      <button type="button" onClick={() => onMorphologyDelete(morphology)}>
        <DeleteOutlined />
      </button>
    ),
  };
  const columns = eModelEditMode ? [...defaultColumns, deleteColumn] : defaultColumns;

  return (
    <>
      <div className="text-primary-8 text-2xl font-bold">Exemplar morphology</div>

      <DefaultEModelTable<ExemplarMorphologyDataType>
        dataSource={morphologies || []}
        columns={columns}
      />

      {eModelEditMode && (
        <>
          <GenericButton
            className="border-primary-7 text-primary-7 mt-2"
            text="Assign morphology"
            onClick={() => {
              setOpenPicker(true);
            }}
          />
          <PickMorphology
            isOpen={openPicker}
            onCancel={() => setOpenPicker((isOpen) => !isOpen)}
            onOk={() => {}}
          />
        </>
      )}
    </>
  );
}
