'use client';

import { useState } from 'react';
import { ConfigProvider, Table, theme } from 'antd';
import { ColumnType, ColumnsType } from 'antd/es/table';
import { ColumnTitle } from 'antd/es/table/interface';

import { EditingSynapticAssignementRule, SynapticAssignementRule } from './types';
import EditableHemisphereCell from './EditableHemisphereCell';
import EditableTextCell from './EditableTextCell';
import Actions from './Actions';
import { useGetFieldsOptions } from './hooks/get-fields-options';
import { assertString } from '@/util/type-guards';

export interface SynapticAssignementRulesTableProps {
  editable?: boolean;
  rules: SynapticAssignementRule[];
  mode?: 'dark' | 'light';
  onRulesChange(rules: SynapticAssignementRule[]): void;
}

export default function SynapticAssignementRulesTable({
  editable = false,
  rules,
  mode = 'light',
  onRulesChange,
}: SynapticAssignementRulesTableProps) {
  const getFieldsOptions = useGetFieldsOptions();
  const [editingRule, setEditingRule] = useState<null | EditingSynapticAssignementRule>(null);
  const columns: ColumnsType<SynapticAssignementRule> = COLUMNS.map((col) => {
    const key = ensureString(col.key, 'column.key');
    const newCol: ColumnType<SynapticAssignementRule> = {
      ...col,
      render: (value: any, _rule: SynapticAssignementRule, index: number) => {
        const editing = Boolean(editingRule && editingRule.index === index);
        switch (key) {
          case 'fromHemisphere':
          case 'toHemisphere':
            return (
              <EditableHemisphereCell
                editing={editing}
                rule={editingRule}
                field={key}
                content={value}
              />
            );
          default:
            return (
              <EditableTextCell
                editing={editing}
                rule={editingRule}
                field={key}
                content={value}
                options={getFieldsOptions(key).map((name) => ({ value: name, label: name }))}
              />
            );
        }
      },
    };
    return newCol;
  });
  if (editable)
    columns.push({
      render: (_, rule: SynapticAssignementRule, ruleIndex: number) => (
        <Actions
          rule={rule}
          ruleIndex={ruleIndex}
          editing={Boolean(editingRule && editingRule.index === ruleIndex)}
          rules={rules}
          onRulesChange={onRulesChange}
          onStartEditing={(index) => {
            const ruleToEdit = rules[index];
            if (!ruleToEdit) return;

            setEditingRule({ ...ruleToEdit, index });
          }}
          onValidateEdition={async (index) => {
            if (!editingRule) return;

            const newRules = [...rules];
            newRules[index] = editingRule;
            setEditingRule(null);
            onRulesChange(newRules);
          }}
        />
      ),
    });
  return (
    <ConfigProvider
      theme={{
        algorithm: mode === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
      }}
    >
      <Table
        dataSource={rules}
        columns={columns}
        bordered
        pagination={rules.length > 10 ? { position: ['bottomRight'] } : false}
        size={editable ? 'middle' : 'small'}
      />
    </ConfigProvider>
  );
}

const COLUMNS: ColumnsType<SynapticAssignementRule> = [
  makeCol('', 'fromHemisphere'),
  makeCol('Region', 'fromRegion'),
  makeCol('SClass', 'fromSClass'),
  makeCol('M-Type', 'fromMType'),
  makeCol('E-Type', 'fromEType'),
  makeCol('', 'toHemisphere'),
  makeCol('Region', 'toRegion'),
  makeCol('SClass', 'toSClass'),
  makeCol('M-Type', 'toMType'),
  makeCol('E-Type', 'toEType'),
  makeCol('Synapse Type', 'synapticType'),
];

function makeCol(title: ColumnTitle<SynapticAssignementRule>, key: keyof SynapticAssignementRule) {
  return {
    title,
    editable: true,
    key,
    dataIndex: key,
    sorter: (a: SynapticAssignementRule, b: SynapticAssignementRule) =>
      (a[key] ?? '').toLowerCase() < (b[key] ?? '').toLowerCase() ? -1 : +1,
  };
}

function ensureString(data: unknown, message: string): keyof SynapticAssignementRule {
  assertString(data, message);
  return data as keyof SynapticAssignementRule;
}
