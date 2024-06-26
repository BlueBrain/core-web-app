import { useState, useMemo, useCallback } from 'react';
import { Button, Drawer, Form, Input, InputNumber, Select } from 'antd';
import { useAtomValue, useSetAtom } from 'jotai';
import { DeleteOutlined } from '@ant-design/icons';
import capitalize from 'lodash/capitalize';

import HemisphereDropdown from '../HemisphereDropdown';
import { variantLabel, unitLabel } from './constants';
import { useValidateEdit } from './hooks';
import { variantColorMapAtom, variantNamesLoadableAtom } from './state';
import { createEmptyEdit } from './utils';
import BrainRegionSelect from './MicroConnectomeBrainRegionSelect';
import {
  configPayloadLoadableAtom,
  editsLoadableAtom,
  hasUnsavedEditsAtom,
} from '@/state/brain-model-config/micro-connectome';
import {
  addEditAtom,
  removeEditAtom,
  updateEditAtom,
  persistConfigAtom,
} from '@/state/brain-model-config/micro-connectome/setters';
import { isConfigEditableAtom } from '@/state/brain-model-config';
import { MicroConnectomeEditEntry } from '@/types/connectome';
import { classNames } from '@/util/utils';
import { useLoadable } from '@/hooks/hooks';

type EditFormProps = {
  value: Partial<MicroConnectomeEditEntry>;
  onChange: (edit: Partial<MicroConnectomeEditEntry>) => void;
  disabled?: boolean;
};

const OPERATIONS: { value: MicroConnectomeEditEntry['operation']; label: string }[] = [
  {
    value: 'setAlgorithm',
    label: 'Set algorithm (including corresponding params)',
  },
  {
    value: 'modifyParams',
    label: 'Modify parameters via linear transform',
  },
];

type VariantLabelProps = {
  variantName: string;
};

function VariantLabel({ variantName }: VariantLabelProps) {
  const variantColorMap = useAtomValue(variantColorMapAtom);

  return (
    <span className="flex items-center" style={{ color: variantColorMap.get(variantName) }}>
      <span
        className="mr-2 h-4 w-4"
        style={{ backgroundColor: variantColorMap.get(variantName) }}
      />
      {variantLabel[variantName] ?? variantName}
    </span>
  );
}

function EditForm({ value, onChange, disabled }: EditFormProps) {
  const configPayload = useLoadable(configPayloadLoadableAtom, null);
  const variantNames = useLoadable(variantNamesLoadableAtom, []);

  const variantOptions = variantNames.map((variantName) => ({
    value: variantName,
    label: <VariantLabel variantName={variantName} />,
  }));

  const srcSelectionArr = useMemo(
    () => (value.srcSelection ? [value.srcSelection] : []),
    [value.srcSelection]
  );
  const dstSelectionArr = useMemo(
    () => (value.dstSelection ? [value.dstSelection] : []),
    [value.dstSelection]
  );

  const getParams = (variantName: string | undefined) =>
    variantName
      ? Object.keys(configPayload?.variants?.[variantName].params ?? {})
          .sort()
          .map((paramName) => ({
            name: paramName,
            unitCode: configPayload?.variants?.[variantName as string].params[paramName].unitCode,
            default: configPayload?.variants?.[variantName as string].params[paramName].default,
          }))
      : [];

  const params = getParams(value.variantName);

  const getDefaultEditEntryParams = (
    operation: MicroConnectomeEditEntry['operation'],
    variantName: string | undefined
  ) =>
    getParams(variantName).reduce(
      (obj, param) => ({
        ...obj,
        [param.name]:
          operation === 'setAlgorithm'
            ? param.default
            : {
                multiplier: 1,
                offset: 0,
              },
      }),
      {}
    );

  const setOperation = (operation: MicroConnectomeEditEntry['operation']) => {
    const editEntryParams: MicroConnectomeEditEntry['params'] = getDefaultEditEntryParams(
      operation,
      value.variantName
    );

    onChange({
      ...value,
      operation,
      params: editEntryParams,
    } as Partial<MicroConnectomeEditEntry>);
  };

  const setVariant = (variantName: string) => {
    const editEntryParams: MicroConnectomeEditEntry['params'] = getDefaultEditEntryParams(
      value.operation as MicroConnectomeEditEntry['operation'],
      variantName
    );

    onChange({
      ...value,
      variantName,
      params: editEntryParams,
    } as Partial<MicroConnectomeEditEntry>);
  };

  const setParamValue = (paramName: string, paramValue: number | null) => {
    if (paramValue === null || value.operation !== 'setAlgorithm') return;

    onChange({
      ...value,
      params: {
        ...value.params,
        [paramName]: paramValue,
      },
    });
  };

  const setParamLinearTransformValue = (
    paramName: string,
    type: 'multiplier' | 'offset',
    linerTransformValue: number | null
  ) => {
    if (!value.params || value.operation !== 'modifyParams') return;

    // Replace with a zero transform if user cleans up current input (or fills in not a valid number).
    const zeroTransformValue = type === 'multiplier' ? 1 : 0;
    const sanitizedLinerTransformValue = linerTransformValue ?? zeroTransformValue;

    const paramValue = {
      ...value.params?.[paramName],
      [type]: sanitizedLinerTransformValue,
    };

    onChange({
      ...value,
      params: {
        ...value.params,
        [paramName]: paramValue,
      },
    });
  };

  return (
    <div className="text-white">
      <h3 className="mb-2">Modification name</h3>
      <Input
        value={value.name}
        onChange={(e) => onChange({ ...value, name: e.target.value })}
        disabled={disabled}
      />

      <h3 className="mb-2 mt-8">Hemispheres</h3>
      <HemisphereDropdown
        value={value.hemisphereDirection}
        onChange={(hemisphereDirection) => onChange({ ...value, hemisphereDirection })}
        disabled={disabled}
      />

      <h3 className="mb-2 mt-4">Pre-synaptic</h3>
      <BrainRegionSelect
        value={srcSelectionArr}
        onChange={(selectionArr) => onChange({ ...value, srcSelection: selectionArr.at(-1) })}
        disabled={disabled}
        tagWidth={354}
      />

      <h3 className="mb-2 mt-4">Post-synaptic</h3>
      <BrainRegionSelect
        value={dstSelectionArr}
        onChange={(selectionArr) => onChange({ ...value, dstSelection: selectionArr.at(-1) })}
        disabled={disabled}
        tagWidth={354}
      />

      <h3 className="mb-2 mt-8">Choose a modification type</h3>
      <Select
        className="w-full"
        value={value.operation}
        options={OPERATIONS}
        onChange={setOperation}
        disabled={disabled}
      />

      {value.operation && (
        <>
          <h3 className="mb-2 mt-4">Choose target algorithm</h3>
          <Select
            className="w-full"
            value={value.variantName}
            options={variantOptions}
            onChange={setVariant}
            disabled={disabled}
          />
        </>
      )}

      {value.operation === 'setAlgorithm' && value.variantName && (
        <>
          <h3 className="mb-2 mt-4">Provide parameters</h3>
          <Form labelCol={{ span: 10 }} wrapperCol={{ span: 14 }} layout="horizontal" size="small">
            {params.map((param) => (
              <Form.Item key={param.name} label={capitalize(param.name).replace('_', ' ')}>
                <InputNumber
                  className="w-full"
                  value={value.params?.[param.name]}
                  addonAfter={unitLabel[param.unitCode ?? ''] ?? param.unitCode}
                  onChange={(paramValue) => setParamValue(param.name, paramValue)}
                  disabled={disabled}
                />
              </Form.Item>
            ))}
          </Form>
        </>
      )}

      {value.operation === 'modifyParams' && value.variantName && (
        <>
          <h3 className="mb-2 mt-4">Apply linear transformation</h3>
          <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} layout="horizontal" size="small">
            {params.map((param) => (
              <Form.Item key={param.name} label={capitalize(param.name).replace('_', ' ')}>
                <InputNumber
                  className="w-full"
                  addonBefore={
                    <span
                      className={classNames(
                        'block w-[60px]',
                        value.params?.[param.name].multiplier === 1 && 'text-gray-500'
                      )}
                    >
                      Multiplier
                    </span>
                  }
                  addonAfter={unitLabel[param.unitCode ?? ''] ?? param.unitCode}
                  value={value.params?.[param.name].multiplier}
                  onChange={(multiplier) =>
                    setParamLinearTransformValue(param.name, 'multiplier', multiplier)
                  }
                  disabled={disabled}
                />
                <InputNumber
                  className="mt-2 w-full"
                  addonBefore={
                    <span
                      className={classNames(
                        'block w-[60px]',
                        value.params?.[param.name].offset === 0 && 'text-gray-500'
                      )}
                    >
                      Offset
                    </span>
                  }
                  value={value.params?.[param.name].offset}
                  onChange={(offset) => setParamLinearTransformValue(param.name, 'offset', offset)}
                  disabled={disabled}
                />
              </Form.Item>
            ))}
          </Form>
        </>
      )}
    </div>
  );
}

type ModifyEditDrawerProps = {
  title: string;
  value: Partial<MicroConnectomeEditEntry>;
  onChange: (edit: Partial<MicroConnectomeEditEntry>) => void;
  onDone: () => void;
  open: boolean;
  onClose: () => void;
};

function ModifyEditDrawer({
  title,
  value,
  onChange,
  onDone,
  open,
  onClose,
}: ModifyEditDrawerProps) {
  const isEditable = useAtomValue(isConfigEditableAtom);

  const validateEdit = useValidateEdit();

  const [loading, setLoading] = useState<boolean>(false);

  const editValid = validateEdit(value);

  const onDoneLocal = async () => {
    setLoading(true);
    await onDone();
    setLoading(false);
  };

  return (
    <Drawer
      title={title}
      onClose={onClose}
      open={open}
      width={480}
      extra={
        <Button
          onClick={onDoneLocal}
          type="primary"
          disabled={!editValid || !isEditable}
          loading={loading}
        >
          Save
        </Button>
      }
      destroyOnClose
    >
      <EditForm value={value} onChange={onChange} disabled={loading || !isEditable} />
    </Drawer>
  );
}

function CreateEditBtn() {
  const isEditable = useAtomValue(isConfigEditableAtom);
  const addEditGlobal = useSetAtom(addEditAtom);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [currentEdit, setCurrentEdit] =
    useState<Partial<MicroConnectomeEditEntry>>(createEmptyEdit());

  const addEdit = async () => {
    const edit = currentEdit as MicroConnectomeEditEntry;

    await addEditGlobal(edit);

    setDrawerOpen(false);
    setCurrentEdit(createEmptyEdit());
  };

  return (
    <>
      <Button onClick={() => setDrawerOpen(true)} block disabled={!isEditable}>
        Add modification
      </Button>

      {isEditable && (
        <ModifyEditDrawer
          title="Create a modification"
          value={currentEdit}
          onChange={setCurrentEdit}
          onDone={addEdit}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
}

type EditHistoryEntryProps = {
  value: MicroConnectomeEditEntry;
  onClick?: (edit: MicroConnectomeEditEntry) => void;
  onRemove?: (edit: MicroConnectomeEditEntry) => void;
};

function EditHistoryEntry({ value, onClick, onRemove }: EditHistoryEntryProps) {
  const isEditable = useAtomValue(isConfigEditableAtom);

  return (
    <div className="mt-1 flex items-center justify-between">
      <button
        className="mr-2 cursor-pointer truncate"
        title={value.name}
        type="button"
        onClick={() => onClick?.(value)}
      >
        {value.name}
      </button>

      {isEditable && (
        <DeleteOutlined
          className="cursor-pointer"
          type="button"
          onClick={() => onRemove?.(value)}
        />
      )}
    </div>
  );
}

function EditHistory() {
  const isEditable = useAtomValue(isConfigEditableAtom);

  const rawEdits = useLoadable(editsLoadableAtom, []);

  const removeEdit = useSetAtom(removeEditAtom);
  const updateEdit = useSetAtom(updateEditAtom);

  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [currentEdit, setCurrentEdit] = useState<Partial<MicroConnectomeEditEntry>>();

  const edits = useMemo(() => rawEdits ?? [], [rawEdits]);

  const updateEditLocal = useCallback(async () => {
    if (!currentEdit) return;

    await updateEdit(currentEdit as MicroConnectomeEditEntry);

    setDrawerOpen(false);
  }, [currentEdit, updateEdit]);

  const openEntryEditDrawer = useCallback((edit: MicroConnectomeEditEntry) => {
    setCurrentEdit(edit);
    setDrawerOpen(true);
  }, []);

  return (
    <>
      <h3 className="mb-2 mt-8 text-lg">
        Connectivity modifications{' '}
        {edits.length && <span className="text-slate-400">({edits.length})</span>}
      </h3>

      {edits.length === 0 && <span className="mt-1 text-slate-400">No modifications</span>}

      {edits.map((edit) => (
        <EditHistoryEntry
          key={edit.name}
          value={edit}
          onClick={openEntryEditDrawer}
          onRemove={removeEdit}
        />
      ))}

      {currentEdit && (
        <ModifyEditDrawer
          title={isEditable ? 'Edit a modification' : 'View a modification'}
          value={currentEdit}
          onChange={setCurrentEdit}
          onDone={updateEditLocal}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        />
      )}
    </>
  );
}

export function MicroConnectomeEditBar() {
  const persistConfig = useSetAtom(persistConfigAtom);
  const hasUnsavedEdits = useAtomValue(hasUnsavedEditsAtom);

  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await persistConfig();
    setSaving(false);
  };

  // TODO Implement auto-save functionality.

  return (
    <>
      <CreateEditBtn />

      <EditHistory />

      <Button
        className="mt-8"
        block
        size="small"
        type="primary"
        disabled={!hasUnsavedEdits}
        loading={saving}
        onClick={save}
      >
        Save
      </Button>
    </>
  );
}
