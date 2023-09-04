import { useEffect } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { ColumnsType } from 'antd/es/table';
import { DeleteOutlined } from '@ant-design/icons';

import DefaultEModelTable from './DefaultEModelTable';
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

  useEffect(() => {
    if (!eModelEditMode || !exemplarMorphology) return;

    setEModelUIConfig((oldAtomData) => ({
      ...oldAtomData,
      morphology: structuredClone(exemplarMorphology),
    }));
  }, [eModelEditMode, exemplarMorphology, setEModelUIConfig]);

  const onMorphologyDelete = () => {
    setEModelUIConfig((oldAtomData) => {
      if (!oldAtomData?.morphology) return oldAtomData;

      return {
        ...oldAtomData,
        morphology: null,
      };
    });
  };

  const morphology = eModelEditMode ? eModelUIConfig?.morphology : exemplarMorphology;
  const deleteColumn = {
    title: '',
    key: 'action',
    render: () => (
      <button type="button" onClick={onMorphologyDelete}>
        <DeleteOutlined />
      </button>
    ),
  };
  const columns = eModelEditMode ? [...defaultColumns, deleteColumn] : defaultColumns;

  return (
    <>
      <div className="text-primary-8 text-2xl font-bold">Exemplar morphology</div>
      {morphology && <DefaultEModelTable dataSource={[morphology]} columns={columns} />}
      {eModelEditMode && (
        <GenericButton
          className="border-primary-7 text-primary-7 mt-2"
          text="Assign morphology"
          disabled
        />
      )}
    </>
  );
}
