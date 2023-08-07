'use client';

import { useMemo, useState } from 'react';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  LoadingOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { atom, useAtom, useSetAtom } from 'jotai';
import { Select, InputNumber, Input, Modal, Button } from 'antd';

import AddRuleModal from './AddRuleModal';
import RulesFilters from './RulesFilters';
import Filter from './RulesFilters/filter';
import { useDefaultRules, useFetchRules, useSetRules, useSynapseTypeUseCount } from './hooks';
import SynapticAssignmentRulesTable from './SynapticAssignmentRulesTable';
import { loadingAtom, synapticModelsAtom, userTypesAtom } from './state';
import { classNames } from '@/util/utils';
import { SynapticAssignmentRule, SynapticType } from '@/types/connectome-model-assignment';
import styles from './connectome-model-assignment.module.scss';

const ACTIVE_TAB_CLASSNAME =
  'text-primary-8 bg-white inline-flex justify-center items-center font-bold text-primary-8 text-sm';
const INACTIVE_TAB_CLASSNAME =
  'text-white bg-black inline-flex justify-center items-center text-sm';

const typeUsedInRulesAtom = atom(0);
const selectedTypeIdxAtom = atom<number | null>(null);
const emptyType: SynapticType & { name: string } = {
  name: '',
  gsyn: 0,
  gsynSD: 0,
  nrrp: 0,
  dtc: 0,
  dtcSD: 0,
  u: 0,
  uSD: 0,
  d: 0,
  dSD: 0,
  f: 0,
  fSD: 0,
  gsynSRSF: 0,
  uHillCoefficient: 0,
};

export default function ConnectomeModelAssignmentView() {
  const [addRuleModalOpen, setAddRuleModalOpen] = useState(false);
  const userRules = useFetchRules();
  const defaultRules = useDefaultRules();
  const setUserRules = useSetRules();
  const [userRulesFilter, setUserRulesFilter] = useState(new Filter([]));
  const [rulesTabActive, setRulesTabActive] = useState(true);
  const [loading] = useAtom(loadingAtom);
  const [types, setTypes] = useAtom(userTypesAtom);
  const [selectedTypeIdx, setSelectedTypeIdx] = useAtom(selectedTypeIdxAtom);
  const [typeUsedinRules, setTypeUsedInRules] = useAtom(typeUsedInRulesAtom);
  const [addTypeModalOpen, setAddTypeModalOpen] = useState(false);
  const [newType, setNewType] = useState(emptyType);
  const [models] = useAtom(synapticModelsAtom);
  const [typeSearch, setTypeSearch] = useState('');
  const nVisible = useMemo(
    () => types.filter(([t]) => t.toLowerCase().includes(typeSearch)).length,
    [types, typeSearch]
  );

  return (
    <>
      <div className="bg-black mr-7 relative">
        <div className="text-white">
          <h1 className="text-white font-bold p-4">Default synapse model assignments</h1>
          <div style={{ width: '90%' }}>
            <div className="w-1/2 flex justify-between" style={{ marginLeft: 16 }}>
              <div>From ⭢</div>
              <div>⭢ To</div>
            </div>
          </div>
          <div className="p-8">
            <SynapticAssignmentRulesTable
              className={styles.table}
              rules={defaultRules}
              onRulesChange={() => {}}
              mode="dark"
            />
          </div>
        </div>
        <div className="text-white bg-white relative">
          <div className="flex" style={{ height: '50px' }}>
            <div className="bg-black inline-block" style={{ height: '50px', width: '30px' }} />
            <button
              type="button"
              className={rulesTabActive ? ACTIVE_TAB_CLASSNAME : INACTIVE_TAB_CLASSNAME}
              style={{ height: '50px', width: '250px' }}
              onClick={() => setRulesTabActive(true)}
            >
              User defined synapse model assignments
            </button>
            <button
              type="button"
              className={rulesTabActive ? INACTIVE_TAB_CLASSNAME : ACTIVE_TAB_CLASSNAME}
              style={{ height: '50px', width: '150px' }}
              onClick={() => setRulesTabActive(false)}
            >
              Synapse Type editor
            </button>
            <div className="flex-1 bg-black" />
          </div>
          <div className="p-4 pb-20">
            {rulesTabActive && (
              <>
                <RulesFilters rules={userRules} onFilterChange={setUserRulesFilter} />
                <div className="text-primary-8 mb-5" style={{ width: '90%' }}>
                  <div className="w-1/2 flex justify-between" style={{ marginLeft: 8 }}>
                    <div>From ⭢</div>
                    <div>⭢ To</div>
                  </div>
                </div>
                <SynapticAssignmentRulesTable
                  className={styles.table}
                  rules={userRules}
                  filter={userRulesFilter.exec}
                  onRulesChange={setUserRules}
                  editable
                />
              </>
            )}

            {!rulesTabActive && types && (
              <>
                <div className="sticky top-0 bg-white py-4">
                  <div className="flex justify-between">
                    <div className="font-bold text-primary-8">Total: {nVisible} types</div>
                    <Input.Search
                      placeholder="Search for type"
                      className="w-48 mb-2 text-xs"
                      size="small"
                      onChange={(v) => setTypeSearch(v.target.value.toLowerCase())}
                      allowClear
                    />
                  </div>
                  <div className={`${styles.synapseType} flex text-neutral-4`}>
                    <div style={{ flex: 1.9 }}>Type</div>
                    <div style={{ flex: 2.5 }}>Synaptic Model</div>
                    <div>gsyn</div>
                    <div>gsynSD</div>
                    <div>nrrp</div>
                    <div>dtc</div>
                    <div>dtcSD</div>
                    <div>u</div>
                    <div>uSD</div>
                    <div>d</div>
                    <div>dSD</div>
                    <div>f</div>
                    <div>fSD</div>
                    <div>gsynSRSF</div>
                    <div>uHillCoefficient</div>
                    <div style={{ flex: 1.1 }} />
                  </div>
                </div>
                {types.map(([k, type], i) => (
                  <SynapticTypeRow
                    key={i} //eslint-disable-line
                    i={i}
                    name={k}
                    type={type}
                    visible={k.toLowerCase().includes(typeSearch)}
                  />
                ))}
              </>
            )}
          </div>
        </div>

        {rulesTabActive && (
          <div className="fixed" style={{ right: 35, bottom: 8 }}>
            <button
              type="button"
              className={classNames(styles.button, 'bg-primary-8')}
              onClick={() => setAddRuleModalOpen(true)}
              disabled={loading}
            >
              {!loading && <PlusOutlined />}
              {loading && <LoadingOutlined />}
              &nbsp;&nbsp;Add synapse assignment rule
            </button>
            <button type="button" className={classNames(styles.button, 'bg-black')}>
              <EyeOutlined />
              &nbsp;&nbsp;Preview on Matrix
            </button>
          </div>
        )}
        {!rulesTabActive && (
          <div className="fixed" style={{ right: 35, bottom: 8 }}>
            <button
              type="button"
              className={classNames(styles.button, 'bg-primary-8')}
              onClick={() => setAddTypeModalOpen(true)}
              disabled={loading}
            >
              {!loading && <PlusOutlined />}
              {loading && <LoadingOutlined />}
              &nbsp;&nbsp;Add synaptic type
            </button>
            <button type="button" className={classNames(styles.button, 'bg-black')}>
              <EyeOutlined />
              &nbsp;&nbsp;Preview on Matrix
            </button>
          </div>
        )}
      </div>
      <AddRuleModal
        open={addRuleModalOpen}
        onValidate={(rule: SynapticAssignmentRule) => {
          setAddRuleModalOpen(false);
          setUserRules([...userRules, rule]);
        }}
        onCancel={() => setAddRuleModalOpen(false)}
      />
      <Modal
        open={typeUsedinRules > 0}
        footer={null}
        onCancel={() => setTypeUsedInRules(0)}
        bodyStyle={{
          height: '25vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className="text-error mb-8 font-bold text-center w-1/2">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          You can't delete this type because it is used in{' '}
          <span className="text-white bg-error">{typeUsedinRules} pathways</span>
        </div>
        <Button type="primary" onClick={() => setTypeUsedInRules(0)}>
          OK
        </Button>
      </Modal>
      <Modal
        open={selectedTypeIdx !== null}
        onOk={() => {
          setTypes([
            ...types.slice(0, selectedTypeIdx as number),
            ...types.slice((selectedTypeIdx as number) + 1, types.length),
          ]);
          setSelectedTypeIdx(null);
        }}
        onCancel={() => setSelectedTypeIdx(null)}
        bodyStyle={{
          height: '25vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className="font-bold text-primary-8">
          Are you sure you want to delete this synapse type?
        </div>
      </Modal>
      <Modal
        open={addTypeModalOpen}
        onOk={() => {
          setTypes([...types, [newType.name, newType]]);
          setNewType(emptyType);
          setAddTypeModalOpen(false);
        }}
        okButtonProps={{ disabled: !newType.name }}
        onCancel={() => {
          setAddTypeModalOpen(false);
          setNewType(emptyType);
        }}
      >
        <div className="flex justify-between">
          <div className="flex flex-col">
            <div className="font-bold text-primary-8">Type</div>
            <Input
              style={{ marginTop: 2 }}
              placeholder="Write your type name"
              value={newType.name}
              onChange={(v) => {
                setNewType({ ...newType, name: v.currentTarget.value });
              }}
            />
          </div>
          <div className="flex flex-col" style={{ marginRight: 5 }}>
            <div className="font-bold text-primary-8" style={{ marginBottom: 5 }}>
              Select Model
            </div>
            <Select
              size="small"
              defaultValue={newType.synapticModel || models[0] || ''}
              onSelect={(v) => {
                setNewType({ ...newType, synapticModel: v });
              }}
            >
              <Select.Option value={models[0]} style={{ fontSize: 10 }}>
                {models[0]}
              </Select.Option>
              <Select.Option value={models[1]} style={{ fontSize: 10 }}>
                {models[1]}
              </Select.Option>
            </Select>
          </div>
        </div>
        <div className="mt-10 text-neutral-4" style={{ fontSize: 11 }}>
          <div className="flex">
            <div style={{ flex: 1 }}>PARAMETER</div>
            <div style={{ flex: 1 }}>VALUE</div>
          </div>
          <div className={styles.modalParam}>
            <div>gsyn</div>
            <div>
              <InputNumber
                size="small"
                className={styles.input}
                value={newType.gsyn}
                precision={1}
                onChange={(v) => {
                  if (v !== null) setNewType({ ...newType, gsyn: v });
                }}
              />
            </div>
          </div>
          <div className={styles.modalParam}>
            <div>dtc</div>
            <div>
              <InputNumber
                size="small"
                className={styles.input}
                value={newType.dtc}
                precision={1}
                onChange={(v) => {
                  if (v !== null) setNewType({ ...newType, dtc: v });
                }}
              />
            </div>
          </div>

          <div className={styles.modalParam}>
            <div>u</div>
            <div>
              <InputNumber
                size="small"
                className={styles.input}
                value={newType.u}
                precision={1}
                onChange={(v) => {
                  if (v !== null) setNewType({ ...newType, u: v });
                }}
              />
            </div>
          </div>

          <div className={styles.modalParam}>
            <div>d</div>
            <div>
              <InputNumber
                size="small"
                className={styles.input}
                value={newType.d}
                precision={1}
                onChange={(v) => {
                  if (v !== null) setNewType({ ...newType, d: v });
                }}
              />
            </div>
          </div>

          <div className={styles.modalParam}>
            <div>dSD</div>
            <div>
              <InputNumber
                size="small"
                className={styles.input}
                value={newType.dSD}
                precision={1}
                onChange={(v) => {
                  if (v !== null) setNewType({ ...newType, dSD: v });
                }}
              />
            </div>
          </div>

          <div className={styles.modalParam}>
            <div>f</div>
            <div>
              <InputNumber
                size="small"
                className={styles.input}
                value={newType.f}
                precision={1}
                onChange={(v) => {
                  if (v !== null) setNewType({ ...newType, f: v });
                }}
              />
            </div>
          </div>

          <div className={styles.modalParam}>
            <div>gsynSRSF</div>
            <div>
              <InputNumber
                size="small"
                className={styles.input}
                value={newType.gsynSRSF}
                precision={1}
                onChange={(v) => {
                  if (v !== null) setNewType({ ...newType, gsynSRSF: v });
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

function SynapticTypeRow({
  i,
  name,
  type,
  visible = true,
}: {
  i: number;
  name: string;
  type: SynapticType;
  visible?: boolean;
}) {
  const [types, setTypes] = useAtom(userTypesAtom);
  const [models] = useAtom(synapticModelsAtom);
  const [localType, setLocalType] = useState<SynapticType>(type);
  const [editing, setEditing] = useState(false);
  const usedSynapseTypes = useSynapseTypeUseCount();

  const setSelectedTypeIdx = useSetAtom(selectedTypeIdxAtom);
  const setTypeUsedInRules = useSetAtom(typeUsedInRulesAtom);

  if (!visible) return null;

  if (!editing)
    return (
      <div className={classNames('flex', styles.synapseType, 'text-primary-8')}>
        <div style={{ flex: 1.9 }}>{name}</div>
        <div style={{ flex: 2.5 }}>{type.synapticModel || models[0] || ''}</div>
        <div>{type.gsyn}</div>
        <div>{type.gsynSD}</div>
        <div>{type.nrrp}</div>
        <div>{type.dtc}</div>
        <div>{type.dtcSD}</div>
        <div>{type.u}</div>
        <div>{type.uSD}</div>
        <div>{type.d}</div>
        <div>{type.dSD}</div>
        <div>{type.f}</div>
        <div>{type.fSD}</div>
        <div>{type.gsynSRSF}</div>
        <div>{type.uHillCoefficient}</div>
        <div style={{ flex: 1.1 }}>
          <CopyOutlined
            className={styles.icon}
            onClick={() =>
              setTypes([...types.slice(0, i), [name, { ...type }], ...types.slice(i, types.length)])
            }
          />
          <EditOutlined className={styles.icon} onClick={() => setEditing(true)} />
          <DeleteOutlined
            className={styles.icon}
            onClick={() => {
              if (name in usedSynapseTypes) {
                setTypeUsedInRules(usedSynapseTypes[name]);
                return;
              }
              setSelectedTypeIdx(i);
            }}
          />
        </div>
      </div>
    );

  return (
    <div className={classNames('flex', styles.synapseType, 'text-primary-8')}>
      <div style={{ flex: 1.9 }}>{name}</div>
      <div style={{ flex: 2.5 }} className={styles.select}>
        <Select
          size="small"
          defaultValue={localType.synapticModel || models[0] || ''}
          onSelect={(v) => setLocalType({ ...localType, synapticModel: v })}
        >
          <Select.Option value={models[0]} style={{ fontSize: 10 }}>
            {models[0]}
          </Select.Option>
          <Select.Option value={models[1]} style={{ fontSize: 10 }}>
            {models[1]}
          </Select.Option>
        </Select>
      </div>
      <div>
        <InputNumber
          size="small"
          className={styles.input}
          value={localType.gsyn}
          precision={1}
          onChange={(v) => {
            if (v !== null) setLocalType({ ...localType, gsyn: v });
          }}
        />
      </div>
      <div>{type.gsynSD}</div>
      <div>{type.nrrp}</div>
      <div>
        <InputNumber
          size="small"
          className={styles.input}
          value={localType.dtc}
          precision={1}
          onChange={(v) => {
            if (v !== null) setLocalType({ ...localType, dtc: v });
          }}
        />
      </div>
      <div>{type.dtcSD}</div>
      <div>
        <InputNumber
          size="small"
          className={styles.input}
          value={localType.u}
          precision={1}
          onChange={(v) => {
            if (v !== null) setLocalType({ ...localType, u: v });
          }}
        />
      </div>
      <div>{type.uSD}</div>
      <div>
        <InputNumber
          size="small"
          className={styles.input}
          value={localType.d}
          precision={1}
          onChange={(v) => {
            if (v !== null) setLocalType({ ...localType, d: v });
          }}
        />
      </div>
      <div>
        <InputNumber
          size="small"
          className={styles.input}
          value={localType.dSD}
          precision={1}
          onChange={(v) => {
            if (v !== null) setLocalType({ ...localType, dSD: v });
          }}
        />
      </div>
      <div>
        <InputNumber
          size="small"
          className={styles.input}
          value={localType.f}
          precision={1}
          onChange={(v) => {
            if (v !== null) setLocalType({ ...localType, f: v });
          }}
        />
      </div>
      <div>{type.fSD}</div>
      <div>
        <InputNumber
          size="small"
          className={styles.input}
          value={localType.gsynSRSF}
          precision={1}
          onChange={(v) => {
            if (v !== null) setLocalType({ ...localType, gsynSRSF: v });
          }}
        />
      </div>
      <div>{type.uHillCoefficient}</div>

      <div style={{ flex: 1.1 }}>
        <CheckCircleOutlined
          className={styles.icon}
          onClick={() => {
            setTypes([
              ...types.slice(0, i),
              [name, { ...localType }],
              ...types.slice(i + 1, types.length),
            ]);
            setEditing(false);
          }}
        />
        <CloseCircleOutlined
          className={styles.icon}
          onClick={() => {
            setLocalType(type);
            setEditing(false);
          }}
        />
      </div>
    </div>
  );
}
