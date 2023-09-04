import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { TreeSelect, TreeNodeProps, Popover, Input, Checkbox, Space, Button } from 'antd';
import { CloseOutlined, DownOutlined } from '@ant-design/icons';

import { useBrainRegionMtypeMap, useSelectionSorterFn } from './hooks';
import { BrainRegion } from '@/types/ontologies';
import { PathwaySideSelection as Selection } from '@/types/connectome';
import { ensureArray } from '@/util/nexus';
import { classNames } from '@/util/utils';

import {
  brainRegionByNotationMapAtom,
  brainRegionsTreeWithRepresentationAtom,
} from '@/state/brain-regions';

import style from './brain-region-select.module.scss';

const DEFAULT_TAG_WIDTH = 220;

type SelectionEntryProps = {
  brainRegionNotation: string;
  mtypeFilterSet?: Set<string>;
  onMtypeFilterSetChange: (
    brainRegionNotation: string,
    mtypeFilterSet: Set<string> | undefined
  ) => void;
  onClose?: () => void;
  width?: number;
};

function filterTreeNode(searchStr: string, brainRegion: BrainRegion) {
  const searchStrLowerCase = searchStr.toLowerCase();

  const titleLower = (brainRegion.title as string).toLowerCase();
  if (searchStrLowerCase.split(' ').every((token) => titleLower.includes(token))) return true;

  const notationLower = (brainRegion.notation as string).toLowerCase();
  return searchStrLowerCase.split(' ').every((token) => notationLower.includes(token));
}

function SelectionEntry({
  brainRegionNotation,
  mtypeFilterSet,
  onMtypeFilterSetChange,
  onClose,
  width = DEFAULT_TAG_WIDTH,
}: SelectionEntryProps) {
  const brainRegionByNotationMap = useAtomValue(brainRegionByNotationMapAtom);
  const brainRegionMtypeMap = useBrainRegionMtypeMap();

  const [filterStr, setFilterStr] = useState<string>('');
  const filterStrLowerCase = filterStr.toLowerCase();

  const brainRegion = brainRegionByNotationMap?.get(brainRegionNotation);
  const color = brainRegion?.colorCode;
  const title = brainRegion?.title;

  const mtypeSet = brainRegionMtypeMap.get(brainRegionNotation);
  const mtypes = Array.from(mtypeSet ?? []).sort();
  const nMtypes = mtypes.length;

  const filterTokens = filterStrLowerCase.split(' ');

  const filteredMtypes = filterStr
    ? mtypes.filter((mtype) => filterTokens.every((token) => mtype.toLowerCase().includes(token)))
    : mtypes;

  const nFilteredMtypes = filteredMtypes.length;

  const onChange = (mtype: string, checked: boolean) => {
    const newMtypeFilterSet = new Set(mtypeFilterSet).add(mtype);

    if (checked) {
      newMtypeFilterSet.add(mtype);
    } else {
      newMtypeFilterSet.delete(mtype);
    }

    onMtypeFilterSetChange(
      brainRegionNotation,
      newMtypeFilterSet.size ? newMtypeFilterSet : undefined
    );
  };

  const onSelectAllCurrent = () => {
    onMtypeFilterSetChange(
      brainRegionNotation,
      filteredMtypes.reduce((set, mtype) => set.add(mtype), new Set(mtypeFilterSet))
    );
  };

  const onReset = () => onMtypeFilterSetChange(brainRegionNotation, undefined);

  const mtypeFilterContent = (
    <div style={{ width: '280px' }}>
      <Input
        autoFocus
        placeholder="M-type filter"
        allowClear
        value={filterStr}
        onChange={(e) => setFilterStr(e.target.value)}
      />

      <div className="mt-4 flex flex-row gap-2">
        <Button className="basis-1/2" onClick={onSelectAllCurrent}>
          Select all current
        </Button>
        <Button className="basis-1/2" onClick={onReset}>
          Reset selection
        </Button>
      </div>

      <div className={style.mtypeList}>
        <Space direction="vertical">
          {filteredMtypes.map((mtype) => (
            <Checkbox
              key={mtype}
              checked={mtypeFilterSet?.has(mtype)}
              onChange={(e) => onChange(mtype, e.target.checked)}
            >
              {mtype}
            </Checkbox>
          ))}
        </Space>
      </div>
    </div>
  );

  const popoverTitle =
    nMtypes === nFilteredMtypes
      ? `${brainRegionNotation}: ${nMtypes} m-types`
      : `${brainRegionNotation}: ${nMtypes} m-types (${nFilteredMtypes} shown)`;

  const mtypeStatsStr =
    mtypeFilterSet && mtypeFilterSet.size && mtypeFilterSet.size !== mtypeSet?.size
      ? `${mtypeFilterSet.size} of ${mtypeSet?.size}`
      : `${mtypeSet?.size}`;

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <Popover
        placement="rightTop"
        title={popoverTitle}
        content={mtypeFilterContent}
        trigger="click"
        destroyTooltipOnHide
      >
        <div className={style.container} style={{ width: `${width}px` }} title={title}>
          <span className={style.content}>
            <span className={style.colorTag} style={{ backgroundColor: color }} />

            <strong className="mr-2">{brainRegionNotation}</strong>

            <span className="text-sm">{mtypeStatsStr} m-types</span>
          </span>

          <DownOutlined className={style.downIcon} />

          <CloseOutlined className={style.closeIcon} onClick={onClose} />
        </div>
      </Popover>
    </div>
  );
}

const brainRegionTagRender = (props: TreeNodeProps) => (
  <SelectionEntry
    brainRegionNotation={props.value}
    onClose={props.onClose}
    mtypeFilterSet={props.mtypeFilterSet}
    onMtypeFilterSetChange={props.onMtypeFilterSetChange}
    width={props.width}
  />
);

type BrainRegionSelectProps = {
  value: Selection[];
  onChange: (selections: Selection[]) => void;
  extraPadding?: boolean;
  tagWidth?: number;
  disabled?: boolean;
};

export default function MicroConnectomeBrainRegionSelect({
  value,
  onChange,
  extraPadding,
  tagWidth,
  disabled,
}: BrainRegionSelectProps) {
  const brainRegionTree = useAtomValue(brainRegionsTreeWithRepresentationAtom);

  const selectionSorterFn = useSelectionSorterFn();

  const onMtypeFilterSetChange = (brainRegionNotation: string, mtypeFilterSet: Set<string>) => {
    if (!value) return;

    const newValue = ensureArray(value).map((selection) =>
      selection.brainRegionNotation !== brainRegionNotation
        ? selection
        : { ...selection, mtypeFilterSet }
    );

    onChange(newValue);
  };

  const onBrainRegionSelectionChange = (brainRegionNotations: string | string[]) => {
    const brainRegionNotationList = ensureArray(brainRegionNotations);

    if (brainRegionNotationList.length === 0) {
      return onChange([]);
    }

    const newValue =
      brainRegionNotationList.length > value.length
        ? value
            .concat({ brainRegionNotation: brainRegionNotationList.at(-1) as string })
            .sort(selectionSorterFn)
        : value.filter((selection) =>
            brainRegionNotationList.includes(selection.brainRegionNotation)
          );

    return onChange(newValue);
  };

  return (
    <TreeSelect<string[], BrainRegion>
      className={classNames(style.outerContainer, extraPadding && style.extraPadding)}
      allowClear
      multiple
      disabled={disabled}
      treeData={brainRegionTree?.[0].items}
      treeNodeFilterProp="title"
      treeNodeLabelProp="title"
      popupMatchSelectWidth={520}
      listHeight={320}
      tagRender={(props) =>
        brainRegionTagRender({
          ...props,
          mtypeFilterSet: value.find((v) => v.brainRegionNotation === props.value)?.mtypeFilterSet,
          onMtypeFilterSetChange,
          width: tagWidth,
        })
      }
      value={value.map(({ brainRegionNotation }) => brainRegionNotation)}
      onChange={onBrainRegionSelectionChange}
      fieldNames={{
        label: 'title',
        value: 'notation',
        children: 'items',
      }}
      // Antd's TreeSelect doesn't take into account custom OptionType (defined above)
      // for the arguments of filterTreeNode function, thus the following hack to fix the type mismatch.
      filterTreeNode={filterTreeNode as any}
    />
  );
}
