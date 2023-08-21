import { ColumnsType } from 'antd/es/table';
import { useAtomValue } from 'jotai';
import { Popover } from 'antd';

import DefaultEModelTable from './DefaultEModelTable';
import { experimentalTracesAtom } from '@/state/brain-model-config/cell-model-assignment/e-model';
import { ExperimentalTracesDataType } from '@/types/e-model';

const nameRenderFn = (name: string) => <div className="font-bold">{name}</div>;

const columns: ColumnsType<ExperimentalTracesDataType> = [
  {
    title: 'CELL NAME',
    dataIndex: 'cellName',
    key: 'name',
    render: nameRenderFn,
  },
  {
    title: 'M-TYPE',
    dataIndex: 'mType',
    key: 'mType',
  },
  {
    title: 'E-TYPE',
    dataIndex: 'eType',
    key: 'eType',
  },
  {
    title: 'DESCRIPTION',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'E-CODE',
    key: 'eCode',
    render: (trace: ExperimentalTracesDataType) => {
      const list = (
        <div>
          {trace.eCodes.map((ecode) => (
            <p key={ecode}>{ecode}</p>
          ))}
        </div>
      );
      return (
        <Popover trigger="hover" content={list} placement="left">
          {trace.eCodes.length}
        </Popover>
      );
    },
  },
  {
    title: 'SUBJECT SPECIES',
    dataIndex: 'subjectSpecies',
    key: 'subjectSpecies',
  },
];

export default function ExperimentalTraces() {
  const experimentalTraces = useAtomValue(experimentalTracesAtom);

  return (
    <>
      <div className="text-primary-8 text-2xl font-bold">Experimental traces</div>
      {experimentalTraces && (
        <DefaultEModelTable dataSource={experimentalTraces} columns={columns} />
      )}
    </>
  );
}
