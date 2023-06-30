/* eslint-disable @typescript-eslint/no-use-before-define */
import { CopyOutlined, DeleteFilled } from '@ant-design/icons';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Styles from './synaptic-assignement-rules-table.module.css';

export interface SynapticAssignementRule {
  fromSClass: null | string;
  toSClass: null | string;
  synapticType: string;
  fromHemisphere: null | string;
  toHemisphere: null | string;
  fromRegion: null | string;
  toRegion: null | string;
  fromMType: null | string;
  toMType: null | string;
  toEType: null | string;
  fromEType: null | string;
}

export interface SynapticAssignementRulesTableProps {
  editable?: boolean;
  rules: SynapticAssignementRule[];
  onRulesChange(rules: SynapticAssignementRule[]): void;
}

export default function SynapticAssignementRulesTable({
  editable = false,
  rules,
  onRulesChange,
}: SynapticAssignementRulesTableProps) {
  const columns = editable
    ? [
        ...COLUMNS,
        {
          render: (
            _item: SynapticAssignementRule,
            item: SynapticAssignementRule,
            rowIndex: number
          ) => (
            <div className={Styles.actions}>
              <CopyOutlined
                onClick={() =>
                  onRulesChange([...rules.slice(0, rowIndex), item, ...rules.slice(rowIndex)])
                }
              />
              <DeleteFilled
                onClick={() =>
                  onRulesChange(rules.filter((_, ruleIndex) => rowIndex !== ruleIndex))
                }
              />
            </div>
          ),
        },
      ]
    : COLUMNS;
  return <Table dataSource={rules} columns={columns} />;
}

const COLUMNS: ColumnsType<SynapticAssignementRule> = [
  makeCol('Region', 'fromRegion'),
  makeCol('SClass', 'fromSClass'),
  makeCol('M-Type', 'fromMType'),
  makeCol('E-Type', 'fromEType'),
  makeCol('Region', 'toRegion'),
  makeCol('SClass', 'toSClass'),
  makeCol('M-Type', 'toMType'),
  makeCol('E-Type', 'toEType'),
  makeCol('Synapse Type', 'synapticType'),
];

function makeCol(title: string, key: keyof SynapticAssignementRule) {
  return {
    title,
    key,
    dataIndex: key,
    sorter: (a: SynapticAssignementRule, b: SynapticAssignementRule) =>
      (a[key] ?? '').toLowerCase() < (b[key] ?? '').toLowerCase() ? -1 : +1,
  };
}
