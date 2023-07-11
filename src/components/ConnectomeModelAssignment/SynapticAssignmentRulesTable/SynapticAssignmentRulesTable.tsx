'use client';

/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-props-no-spreading */

import { useMemo, useState } from 'react';
import { ConfigProvider, Table, theme } from 'antd';
import { ColumnType, ColumnsType } from 'antd/es/table';
import { ColumnTitle } from 'antd/es/table/interface';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import DraggableTableRow from './DraggableTableRow';
import EditableHemisphereCell from './EditableHemisphereCell';
import EditableTextCell from './EditableTextCell';
import Actions from './Actions';
import { IndexedSynapticAssignmentRule } from './types';
import { SynapticAssignmentRule } from '@/types/connectome-model-assignment';
import { useFieldsOptionsProvider } from '@/components/ConnectomeModelAssignment/hooks';
import { assertString } from '@/util/type-guards';
import { classNames } from '@/util/utils';

export interface SynapticAssignmentRulesTableProps {
  className?: string;
  editable?: boolean;
  rules: SynapticAssignmentRule[];
  filter?(rule: SynapticAssignmentRule): boolean;
  mode?: 'dark' | 'light';
  onRulesChange(rules: SynapticAssignmentRule[]): void;
}

export default function SynapticAssignmentRulesTable({
  className,
  editable = false,
  rules,
  filter,
  mode = 'light',
  onRulesChange,
}: SynapticAssignmentRulesTableProps) {
  const filteredRules = useFilteredRules(rules, filter);
  const findRuleByKey = (key: string) => filteredRules.find((rule) => rule.key === key);
  const getFieldsOptions = useFieldsOptionsProvider();
  const [editingRule, setEditingRule] = useState<null | IndexedSynapticAssignmentRule>(null);
  const columns: ColumnsType<IndexedSynapticAssignmentRule> = [
    /**
     * This column is the drag & drop handle the user can grab.
     */
    { key: 'sort', width: '3em' },
    ...COLUMNS.map((col) => {
      const columnKey = ensureString(col.key, 'column.key');
      const newCol: ColumnType<IndexedSynapticAssignmentRule> = {
        ...col,
        render: (value: any, rule: IndexedSynapticAssignmentRule) => {
          const editing = editingRule?.key === rule.key;
          switch (columnKey) {
            case 'fromHemisphere':
            case 'toHemisphere':
              return (
                <EditableHemisphereCell
                  editing={editing}
                  rule={editingRule}
                  field={columnKey}
                  content={value}
                />
              );
            default:
              return (
                <EditableTextCell
                  editing={editing}
                  rule={editingRule}
                  field={columnKey}
                  content={value}
                  options={getFieldsOptions(columnKey).map((name) => ({
                    value: name,
                    label: name,
                  }))}
                />
              );
          }
        },
      };
      return newCol;
    }),
  ];
  if (editable)
    columns.push({
      width: '10em',
      render: (_, rule: IndexedSynapticAssignmentRule) => (
        <Actions
          ruleKey={rule.key}
          editingRuleKey={editingRule?.key}
          onCancel={() => setEditingRule(null)}
          onDuplicate={(key) => {
            const ruleToDuplicate = findRuleByKey(key);
            if (!ruleToDuplicate) return;

            const newRules = [...rules];
            const { index } = ruleToDuplicate;
            newRules.splice(index, 0, { ...rules[index] });
            onRulesChange(newRules);
          }}
          onDelete={(key) => {
            const ruleToDelete = findRuleByKey(key);
            if (!ruleToDelete) return;

            const newRules = [...rules];
            const { index } = ruleToDelete;
            newRules.splice(index, 1);
            onRulesChange(newRules);
          }}
          onStartEditing={(key) => {
            const ruleToEdit = findRuleByKey(key);
            if (!ruleToEdit) return;

            setEditingRule({ ...ruleToEdit });
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
  const handleDragEnd = ({ active, over, activatorEvent }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    activatorEvent.preventDefault();
    activatorEvent.stopPropagation();
    activatorEvent.stopImmediatePropagation();
    const from = filteredRules.find((rule) => rule.key === active.id.toString());
    if (!from) return;

    const to = filteredRules.find((rule) => rule.key === over.id.toString());
    if (!to) return;

    onRulesChange(arrayMove(rules, from.index, to.index));
  };
  return (
    <ConfigProvider
      theme={{
        algorithm: mode === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
      }}
    >
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd}>
        <SortableContext
          // rowKey array
          items={filteredRules.map((rule) => rule.key)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            className={classNames(className)}
            dataSource={filteredRules}
            columns={columns}
            components={
              editable && !editingRule
                ? {
                    body: { row: DraggableTableRow },
                  }
                : undefined
            }
            bordered
            pagination={filteredRules.length > 10 ? { position: ['bottomRight'] } : false}
            size={editable ? 'middle' : 'small'}
          />
        </SortableContext>
      </DndContext>
    </ConfigProvider>
  );
}

const COLUMNS = [
  makeCol('', 'fromHemisphere', { width: '3em' }),
  makeCol('Region', 'fromRegion'),
  makeCol('SClass', 'fromSClass'),
  makeCol('M-Type', 'fromMType'),
  makeCol('E-Type', 'fromEType'),
  makeCol('', 'toHemisphere', { width: '3em' }),
  makeCol('Region', 'toRegion'),
  makeCol('SClass', 'toSClass'),
  makeCol('M-Type', 'toMType'),
  makeCol('E-Type', 'toEType'),
  makeCol('Synapse Type', 'synapticType'),
];

function makeCol(
  title: ColumnTitle<IndexedSynapticAssignmentRule>,
  key: keyof SynapticAssignmentRule,
  extra: Partial<ColumnType<IndexedSynapticAssignmentRule>> = {}
): ColumnType<IndexedSynapticAssignmentRule> & { editable: boolean } {
  return {
    ...extra,
    title,
    editable: true,
    key,
    dataIndex: key,
  };
}

function ensureString(data: unknown, message: string): keyof SynapticAssignmentRule {
  assertString(data, message);
  return data as keyof SynapticAssignmentRule;
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
  rules: SynapticAssignmentRule[],
  filter?: (rule: SynapticAssignmentRule) => boolean
): IndexedSynapticAssignmentRule[] {
  return useMemo(() => {
    const indexedRules: IndexedSynapticAssignmentRule[] = rules.map((rule, index) =>
      extendRule(rule, index)
    );
    if (typeof filter !== 'function') return indexedRules;

    return indexedRules.filter(filter);
  }, [rules, filter]);
}

/** To generate an unique id of a drag & dropable row. */
let incrementalCounter = 0;

function extendRule(rule: SynapticAssignmentRule, index: number): IndexedSynapticAssignmentRule {
  incrementalCounter += 1;
  return {
    ...rule,
    index,
    key: `rule-${incrementalCounter}`,
  };
}
