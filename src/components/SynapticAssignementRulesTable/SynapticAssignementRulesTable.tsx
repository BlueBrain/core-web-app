'use client';

import { useMemo, useState } from 'react';
import { ConfigProvider, Table, theme } from 'antd';
import { ColumnType, ColumnsType } from 'antd/es/table';
import { ColumnTitle } from 'antd/es/table/interface';

import { IndexedSynapticAssignementRule, SynapticAssignementRule } from './types';
import EditableHemisphereCell from './EditableHemisphereCell';
import EditableTextCell from './EditableTextCell';
import Actions from './Actions';
import { useGetFieldsOptions } from './hooks/get-fields-options';
import { assertString } from '@/util/type-guards';

export interface SynapticAssignementRulesTableProps {
  editable?: boolean;
  rules: SynapticAssignementRule[];
  filter?(rule: SynapticAssignementRule): boolean;
  mode?: 'dark' | 'light';
  onRulesChange(rules: SynapticAssignementRule[]): void;
}

export default function SynapticAssignementRulesTable({
  editable = false,
  rules,
  filter,
  mode = 'light',
  onRulesChange,
}: SynapticAssignementRulesTableProps) {
  const filteredRules = useFilteredRules(rules, filter);
  const getFieldsOptions = useGetFieldsOptions();
  const [editingRule, setEditingRule] = useState<null | IndexedSynapticAssignementRule>(null);
  const columns: ColumnsType<IndexedSynapticAssignementRule> = COLUMNS.map((col) => {
    const key = ensureString(col.key, 'column.key');
    const newCol: ColumnType<IndexedSynapticAssignementRule> = {
      ...col,
      render: (value: any, rule: IndexedSynapticAssignementRule) => {
        const { index } = rule;
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
      render: (_, rule: IndexedSynapticAssignementRule) => (
        <Actions
          ruleIndex={rule.index}
          editing={Boolean(editingRule && editingRule.index === rule.index)}
          onDuplicate={(index) => {
            const newRules = [...rules];
            newRules.splice(index, 0, { ...rules[index] });
            onRulesChange(newRules);
          }}
          onDelete={(index) => {
            const newRules = [...rules];
            newRules.splice(index, 1);
            onRulesChange(newRules);
          }}
          onStartEditing={(index) => {
            const ruleToEdit = rules[index];
            if (!ruleToEdit) return;

            setEditingRule({ ...ruleToEdit, index });
          }}
          onValidateEdition={async () => {
            if (!editingRule) return;

            const newRules = [...rules];
            newRules[editingRule.index] = editingRule;
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
        dataSource={filteredRules}
        columns={columns}
        bordered
        pagination={filteredRules.length > 10 ? { position: ['bottomRight'] } : false}
        size={editable ? 'middle' : 'small'}
      />
    </ConfigProvider>
  );
}

const COLUMNS = [
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

function makeCol(
  title: ColumnTitle<IndexedSynapticAssignementRule>,
  key: keyof SynapticAssignementRule
): ColumnType<IndexedSynapticAssignementRule> & { editable: boolean } {
  return {
    title,
    editable: true,
    key,
    dataIndex: key,
  };
}

function ensureString(data: unknown, message: string): keyof SynapticAssignementRule {
  assertString(data, message);
  return data as keyof SynapticAssignementRule;
}

/**
 * Filter the rules and add the index on the original list.
 * For instance, the following list of rules
 * ```ts
 * [
 *   {toHemisphere: "left", ...},
 *   {toHemisphere: "right", ...},
 *   {toHemisphere: "left", ...}
 * ]
 * ```
 * after being filtered with `(rule) => rule.toHemisphere === "left"` will become:
 * ```ts
 * [
 *   {index: 0, toHemisphere: "left", ...},
 *   {index: 2, toHemisphere: "left", ...}
 * ]
 * ```
 */
function useFilteredRules(
  rules: SynapticAssignementRule[],
  filter?: (rule: SynapticAssignementRule) => boolean
): IndexedSynapticAssignementRule[] {
  return useMemo(() => {
    const indexedRules: IndexedSynapticAssignementRule[] = rules.map((rule, index) => ({
      ...rule,
      index,
    }));
    if (typeof filter !== 'function') return indexedRules;

    return indexedRules.filter(filter);
  }, [rules, filter]);
}
