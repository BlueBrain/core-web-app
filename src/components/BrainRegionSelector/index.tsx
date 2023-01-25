import React, { useMemo, useState, Dispatch, ReactElement, SetStateAction } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai/react';
import * as Accordion from '@radix-ui/react-accordion';
import { arrayToTree } from 'performant-array-to-tree';
import { Button } from 'antd';
import { PlusOutlined, MinusOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { HeaderProps, TitleComponentProps } from '@/components/BrainRegionSelector/types';
import { classNames } from '@/util/utils';
import ColorBox from '@/components/ColorBox';
import VerticalSwitch from '@/components/VerticalSwitch';
import { BrainIcon, BrainRegionIcon, AngledArrowIcon } from '@/components/icons';
import TreeNavItem from '@/components/tree-nav-item';
import { getBottomUpPath, RegionFullPathType } from '@/util/brain-hierarchy';
import { CompositionUnit } from '@/types/atlas';
import { formatNumber } from '@/util/common';
import {
  brainRegionAtom,
  brainRegionsAtom,
  brainRegionIdAtom,
  setBrainRegionIdAtom,
  compositionAtom,
  densityOrCountAtom,
  meshDistributionsAtom,
} from '@/state/brain-regions';
import BrainRegionVisualizationTrigger from '@/components/BrainRegionVisualizationTrigger';
import styles from './brain-region-selector.module.css';

/**
 * Maps metrics to units in order to appear in the sidebar
 */
const metricToUnit = {
  density: (
    <span>
      /mm<sup>3</sup>
    </span>
  ),
  count: <span>N</span>,
};

function Header({ label, icon }: HeaderProps) {
  return (
    <div className="flex space-x-2 justify-start items-center text-2xl text-white font-bold">
      {React.cloneElement(icon, { style: { height: '1em' } })}
      {label}
    </div>
  );
}

function VisualizationTrigger({ colorCode, id }: { colorCode: string; id: string }) {
  const meshDistributions = useAtomValue(meshDistributionsAtom);

  if (meshDistributions === undefined) {
    return <LoadingOutlined />;
  }

  const meshDistribution =
    meshDistributions && meshDistributions.find(({ id: distributionId }) => distributionId === id);

  if (meshDistribution && colorCode) {
    return (
      <BrainRegionVisualizationTrigger
        regionID={id}
        distribution={meshDistribution}
        colorCode={colorCode}
      />
    );
  }

  return (
    <Button
      className="border-none items-center justify-center flex"
      type="text"
      disabled
      icon={<EyeOutlined style={{ color: '#F5222D' }} />}
    />
  );
}

function CapitalizedTitle({
  colorCode,
  id,
  onClick = () => {},
  title,
  selectedId,
  children, // The Accordion.Trigger
}: TitleComponentProps) {
  return (
    <div
      className="font-bold hover:bg-primary-8 hover:text-white py-3 text-primary-4 flex gap-3 justify-between items-center"
      role="button"
      onClick={() => id && onClick(id)}
      onKeyDown={() => id && onClick(id)}
      tabIndex={0}
    >
      {colorCode ? <ColorBox color={colorCode} /> : null}
      <AngledArrowIcon
        className={classNames(styles.accordionArrow, 'flex-none')}
        style={{ height: '1em' }}
      />
      <span className={classNames(selectedId === id && 'text-white', 'capitalize mr-auto')}>
        {title}
      </span>
      {children}
      {id && colorCode && <VisualizationTrigger colorCode={colorCode} id={id} />}
    </div>
  );
}

function UppercaseTitle({
  colorCode,
  id,
  onClick = () => {},
  title,
  selectedId,
  children, // The Accordion.Trigger
}: TitleComponentProps) {
  return (
    <div
      className="font-bold hover:bg-primary-8 hover:text-white py-3 text-primary-4 flex gap-3 justify-end items-center"
      role="button"
      onClick={() => id && onClick(id)}
      onKeyDown={() => id && onClick(id)}
      tabIndex={0}
    >
      {colorCode ? <ColorBox color={colorCode} /> : null}
      <AngledArrowIcon
        className={classNames(styles.accordionArrow, 'flex-none')}
        style={{ height: '1em' }}
      />
      <span className={classNames(selectedId === id && 'text-white', 'uppercase text-lg mr-auto')}>
        {title}
      </span>
      {children}
      {id && colorCode && <VisualizationTrigger colorCode={colorCode} id={id} />}
    </div>
  );
}

function NeuronCompositionTitle({
  composition,
  title,
  children, // Children is the Accordion.Trigger that triggers the drop-down
}: {
  composition?: JSX.Element;
  title?: string;
  children: ReactElement;
}) {
  return (
    <div className="flex gap-3 items-center justify-end py-3 text-left text-primary-3 w-full whitespace-nowrap hover:text-white">
      <span className="font-bold text-white">{title}</span>
      <span className="ml-auto text-white">{composition}</span>
      {children}
    </div>
  );
}

function NeuronCompositionSubTitle({
  composition,
  title,
}: {
  composition?: number;
  title?: string;
}) {
  return (
    <div className="flex gap-3 items-center justify-between py-3 text-secondary-4 whitespace-nowrap">
      <span className="font-bold whitespace-nowrap">{title}</span>
      <span>~&nbsp;{composition && formatNumber(composition)}</span>
    </div>
  );
}

/**
 * Calculates the metric to be displayed based on whether count or density is
 * currently selected
 */
function getMetric(composition: CompositionUnit, densityOrCount: keyof CompositionUnit) {
  if (composition && densityOrCount === 'count') {
    return formatNumber(composition.count);
  }

  if (composition && densityOrCount === 'density') {
    return formatNumber(composition.density);
  }

  return null;
}

function MeTypeDetails({ neuronComposition }: { neuronComposition: CompositionUnit }) {
  const densityOrCount = useAtomValue(densityOrCountAtom);
  const composition = useAtomValue(compositionAtom);

  const neurons =
    composition &&
    arrayToTree(
      composition.nodes.map(({ neuronComposition: nodeNeuronComposition, label, ...node }) => ({
        ...node,
        composition: nodeNeuronComposition[densityOrCount],
        title: label,
      })),
      {
        dataField: null,
        parentId: 'parentId',
        childrenField: 'items',
      }
    );

  return (
    <>
      <h2 className="flex font-bold justify-between text-white text-lg">
        <span className="justify-self-start">NEURONS [{metricToUnit[densityOrCount]}]</span>
        <small className="font-normal text-base">
          ~ {getMetric(neuronComposition, densityOrCount)}
        </small>
      </h2>
      {neurons && (
        <Accordion.Root type="multiple" className="divide-y divide-primary-6 -ml-5">
          {neurons.map(({ id, items, composition: c, title }) => {
            const normalizedComposition = c ? <span>~&nbsp;{formatNumber(c)}</span> : c;

            return (
              <TreeNavItem
                id={id}
                items={items}
                key={id}
                className="ml-5 divide-y divide-primary-6"
              >
                <NeuronCompositionTitle composition={normalizedComposition} title={title}>
                  <NeuronCompositionSubTitle />
                </NeuronCompositionTitle>
              </TreeNavItem>
            );
          })}
        </Accordion.Root>
      )}
    </>
  );
}

function CollapsedRegionDetailsSidebar({
  title,
  setisMeTypeOpen,
}: {
  title: string;
  setisMeTypeOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="flex flex-col items-center pt-2 w-[40px]">
      <Button
        className="mb-4"
        type="text"
        size="small"
        icon={<PlusOutlined style={{ color: 'white' }} />}
        onClick={() => setisMeTypeOpen(true)}
      />
      <div
        className="text-white flex gap-x-3.5 items-center"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          cursor: 'e-resize',
        }}
        role="presentation"
        onClick={() => setisMeTypeOpen(true)}
      >
        <div className="text-sm">
          View <span className="font-bold">Counts[N]</span>
        </div>
        <div className="text-lg text-secondary-4 font-bold">{title}</div>
      </div>
    </div>
  );
}

function CollapsedBrainRegionsSidebar({
  setIsRegionSelectorOpen,
}: {
  setIsRegionSelectorOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const brainRegionId = useAtomValue(brainRegionIdAtom);
  const brainRegions = useAtomValue(brainRegionsAtom);

  const regionFullPath: RegionFullPathType[] = useMemo(
    () => (brainRegions && brainRegionId ? getBottomUpPath(brainRegions, brainRegionId) : []),
    [brainRegionId, brainRegions]
  );

  // default or if only 'Whole mouse brain selected' discard it.
  if (!regionFullPath.length || regionFullPath.length === 1) {
    return <div className="text-lg font-bold">Brain region</div>;
  }

  // remove 'Whole mouse brain'
  let [, ...displaySubregions] = [...regionFullPath];
  displaySubregions.reverse();

  // if path is too long, make it short with ...
  if (displaySubregions.length > 4) {
    const reducedSubregions = [...displaySubregions].slice(0, 4);
    displaySubregions = [...reducedSubregions, { id: 'dots', name: '...' }];
  }

  // highlight the last element in path (more nested selection)
  const highlightElemId = displaySubregions[0].id;

  const subRegionElems = displaySubregions.map((subregions) => (
    <div
      key={subregions.id}
      className={classNames(
        'text-sm',
        subregions.id === highlightElemId ? 'font-bold' : 'font-thin'
      )}
    >
      {subregions.name}
    </div>
  ));

  return (
    <div className="flex flex-col items-center pt-2 w-[40px]">
      <Button
        className="mb-4"
        type="text"
        size="small"
        icon={<PlusOutlined style={{ color: 'white' }} />}
        onClick={() => setIsRegionSelectorOpen(true)}
      />

      <div
        className="text-white flex gap-x-3.5 items-center"
        style={{
          writingMode: 'vertical-rl',
          transform: 'rotate(180deg)',
          cursor: 'e-resize',
        }}
        role="presentation"
        onClick={() => setIsRegionSelectorOpen(true)}
      >
        {subRegionElems}
        <div className="text-lg font-bold">Brain region</div>
      </div>
    </div>
  );
}

export function BrainRegionsSidebar() {
  const brainRegions = useAtomValue(brainRegionsAtom);
  const brainRegionId = useAtomValue(brainRegionIdAtom);
  const setBrainRegionId = useSetAtom(setBrainRegionIdAtom);

  const [isRegionSelectorOpen, setIsRegionSelectorOpen] = useState<boolean>(true);

  return brainRegions ? (
    <div className="bg-primary-8 flex flex-1 flex-col h-screen">
      {!isRegionSelectorOpen ? (
        <CollapsedBrainRegionsSidebar setIsRegionSelectorOpen={setIsRegionSelectorOpen} />
      ) : (
        <div className="flex flex-1 flex-col overflow-y-auto px-7 py-6 min-w-[300px]">
          <div className="grid">
            <div className="flex justify-between mb-7">
              <Header label={<span>Brain region</span>} icon={<BrainIcon />} />
              <Button
                className="p-2"
                type="text"
                icon={<MinusOutlined style={{ color: 'white' }} />}
                onClick={() => setIsRegionSelectorOpen(false)}
              />
            </div>
            <div className="border-b border-white focus-within:border-primary-2 mb-10">
              <input
                type="text"
                className="block w-full py-3 text-primary-4 placeholder-primary-4 border-0 border-b border-transparent bg-transparent focus:border-primary-4 focus:ring-0"
                disabled
                placeholder="Search region..."
              />
            </div>
            <Accordion.Root type="multiple" className="-ml-5 divide-y divide-primary-7">
              {brainRegions.map(({ colorCode, id, title, ...props }) => (
                <TreeNavItem
                  className="ml-5 divide-y divide-primary-6"
                  id={id}
                  key={id}
                  selectedId={brainRegionId}
                  {...props} // eslint-disable-line react/jsx-props-no-spreading
                >
                  <UppercaseTitle
                    colorCode={colorCode}
                    id={id}
                    onClick={() => setBrainRegionId(id)}
                    title={title}
                  >
                    <CapitalizedTitle onClick={(itemId) => setBrainRegionId(itemId)} />
                  </UppercaseTitle>
                </TreeNavItem>
              ))}
            </Accordion.Root>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="bg-primary-8 h-screen w-[40px] text-neutral-1 text-3xl flex justify-center items-center">
      <LoadingOutlined />
    </div>
  );
}

export function RegionDetailsSidebar() {
  const brainRegion = useAtomValue(brainRegionAtom);
  const [densityOrCount, setDensityOrCount] = useAtom(densityOrCountAtom);
  const [isMeTypeOpen, setisMeTypeOpen] = useState<boolean>(true);

  return (
    brainRegion && (
      <div className="bg-primary-7 flex h-screen overflow-hidden">
        {!isMeTypeOpen && brainRegion && (
          <CollapsedRegionDetailsSidebar
            title={brainRegion?.title}
            setisMeTypeOpen={setisMeTypeOpen}
          />
        )}
        {isMeTypeOpen && (
          <div className="flex flex-col gap-5 overflow-y-auto px-6 py-6 min-w-[300px]">
            <div className="flex justify-between mb-5">
              <Header
                label={<span className="text-secondary-4">{brainRegion?.title}</span>}
                icon={<BrainRegionIcon />}
              />
              <Button
                className="p-2"
                type="text"
                icon={<MinusOutlined style={{ color: 'white' }} />}
                onClick={() => setisMeTypeOpen(false)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex flex-row gap-2 py-4 border-y border-primary-6">
                <div className="flex flex-row gap-3">
                  <VerticalSwitch
                    isChecked={densityOrCount === 'count'}
                    onChange={(checked: boolean) => {
                      const toSet = checked ? 'count' : 'density';
                      // @ts-ignore
                      setDensityOrCount(toSet);
                    }}
                  />
                  <div className="flex flex-col gap-1 text-primary-1">
                    <div>Densities [{metricToUnit.density}]</div>
                    <div>Counts [{metricToUnit.count}]</div>
                  </div>
                </div>
              </div>
            </div>
            <MeTypeDetails neuronComposition={brainRegion.composition.neuronComposition} />
          </div>
        )}
      </div>
    )
  );
}
