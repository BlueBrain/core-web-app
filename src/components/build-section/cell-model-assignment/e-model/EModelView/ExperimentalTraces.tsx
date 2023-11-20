import { useEffect, useState } from 'react';
import { DeleteOutlined, GlobalOutlined } from '@ant-design/icons';
import { ColumnsType } from 'antd/es/table';
import { Divider, Popover } from 'antd';
import { useAtom, useAtomValue } from 'jotai';

import DefaultEModelTable from './DefaultEModelTable';
import PickTraces from './PickTraces';
import ErrorMessageLine from './ErrorMessageLine';
import {
  eModelEditModeAtom,
  eModelUIConfigAtom,
  experimentalTracesAtom,
} from '@/state/brain-model-config/cell-model-assignment/e-model';
import { ExperimentalTracesDataType } from '@/types/e-model';
import { eCodesDocumentationUrl } from '@/constants/cell-model-assignment/e-model';
import GenericButton from '@/components/Global/GenericButton';

const nameRenderFn = (name: string) => <div className="font-bold">{name}</div>;

const eCodesLink = (
  <div className="w-[100px]">
    <a href={eCodesDocumentationUrl} target="_blank">
      More info about e-codes <GlobalOutlined />
    </a>
    <Divider />
  </div>
);

const defaultColumns: ColumnsType<ExperimentalTracesDataType> = [
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
          {eCodesLink}
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
  const eModelEditMode = useAtomValue(eModelEditModeAtom);
  const [eModelUIConfig, setEModelUIConfig] = useAtom(eModelUIConfigAtom);
  const [openPicker, setOpenPicker] = useState(false);

  useEffect(() => {
    if (!eModelEditMode || !experimentalTraces) return;

    setEModelUIConfig((oldAtomData) => ({
      ...oldAtomData,
      traces: structuredClone(experimentalTraces),
    }));
  }, [eModelEditMode, experimentalTraces, setEModelUIConfig]);

  const onTraceDelete = (traceId: string) => {
    setEModelUIConfig((oldAtomData) => {
      if (!oldAtomData?.traces) return oldAtomData;

      return {
        ...oldAtomData,
        traces: oldAtomData.traces.filter((t) => t['@id'] !== traceId),
      };
    });
  };

  const traces = eModelEditMode ? eModelUIConfig?.traces : experimentalTraces;
  const deleteColumn = {
    title: '',
    key: 'action',
    render: (trace: ExperimentalTracesDataType) => (
      <button type="button" onClick={() => onTraceDelete(trace['@id'])} aria-label="Delete">
        <DeleteOutlined />
      </button>
    ),
  };
  const columns = eModelEditMode ? [...defaultColumns, deleteColumn] : defaultColumns;

  const tracesEmptyListMessage = traces?.length ? '' : 'Select at least one trace';

  return (
    <>
      <div className="text-primary-8 text-2xl font-bold">Experimental traces</div>
      {traces && <DefaultEModelTable dataSource={traces} columns={columns} />}

      <ErrorMessageLine message={tracesEmptyListMessage} />

      {eModelEditMode && (
        <>
          <GenericButton
            className="border-primary-7 text-primary-7 mt-2"
            text="Add trace"
            onClick={() => {
              setOpenPicker(true);
            }}
          />
          <PickTraces
            isOpen={openPicker}
            onCancel={() => setOpenPicker(false)}
            onOk={() => setOpenPicker(false)}
          />
        </>
      )}
    </>
  );
}
