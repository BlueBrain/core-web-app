import { useAtomValue } from 'jotai';
import { ColumnsType } from 'antd/es/table';

import DefaultEModelTable from './DefaultEModelTable';
import { examplarMorphologyAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';
import { ExamplarMorphologyDataType } from '@/types/e-model';

const nameRenderFn = (name: string) => <div className="font-bold">{name}</div>;

const columns: ColumnsType<ExamplarMorphologyDataType> = [
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

export default function ExamplarMorphology() {
  const examplarMorphology = useAtomValue(examplarMorphologyAtom);

  return (
    <>
      <div className="text-primary-8 text-2xl font-bold">Examplar morphology</div>
      {examplarMorphology && (
        <DefaultEModelTable dataSource={examplarMorphology} columns={columns} />
      )}
    </>
  );
}
