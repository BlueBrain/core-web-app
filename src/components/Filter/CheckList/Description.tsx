import { useAtomValue } from 'jotai';
import { useMemo } from 'react';
import { unwrap } from 'jotai/utils';
import { Spin } from 'antd';
import { cellTypesByLabelAtom } from '@/state/build-section/cell-types';
import { FieldType } from '@/constants/explore-section/fields-config/types';
import EXPLORE_FIELDS_CONFIG from '@/constants/explore-section/fields-config';

export function CheckListDescription({
  label,
  filterField,
}: {
  label: string;
  filterField: string;
}) {
  const { fieldType } = EXPLORE_FIELDS_CONFIG[filterField];
  if (fieldType === FieldType.CellType) {
    return <ClassDescription label={label} />;
  }
  return null;
}

function ClassDescription({ label }: { label: string }) {
  const classes = useAtomValue(useMemo(() => unwrap(cellTypesByLabelAtom), []));

  if (!classes) {
    return <Spin />;
  }

  return <span className="text-primary-1">{classes[label]?.definition}</span>;
}
