import React, { useCallback, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai/react';
import * as Accordion from '@radix-ui/react-accordion';
import { Button } from 'antd';
import { MinusOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { handleNavValueChange } from './util';
import CollapsedBrainRegionsSidebar from './CollapsedBrainRegions';
import TitleComponentProps from '@/components/BrainRegionSelector/types';
import { classNames } from '@/util/utils';
import ColorBox from '@/components/ColorBox';
import { BrainIcon, AngledArrowIcon } from '@/components/icons';
import TreeNavItem, { NavValue } from '@/components/TreeNavItem';
import {
  brainRegionsAtom,
  brainRegionIdAtom,
  setBrainRegionIdAtom,
  meshDistributionsAtom,
} from '@/state/brain-regions';
import BrainRegionVisualizationTrigger from '@/components/BrainRegionVisualizationTrigger';
import styles from './brain-region-selector.module.css';

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

export default function BrainRegions() {
  const brainRegions = useAtomValue(brainRegionsAtom);
  const brainRegionId = useAtomValue(brainRegionIdAtom);
  const setBrainRegionId = useSetAtom(setBrainRegionIdAtom);

  const [isRegionSelectorOpen, setIsRegionSelectorOpen] = useState<boolean>(true);
  const [brainRegionsNavValue, setNavValue] = useState<NavValue>({});

  const onValueChange = useCallback(
    (newValue: string[], path: string[]) => {
      const callback = handleNavValueChange(brainRegionsNavValue, setNavValue);

      return callback(newValue, path);
    },
    [brainRegionsNavValue, setNavValue]
  );

  return brainRegions ? (
    <div className="bg-primary-8 flex flex-1 flex-col h-screen">
      {!isRegionSelectorOpen ? (
        <CollapsedBrainRegionsSidebar setIsRegionSelectorOpen={setIsRegionSelectorOpen} />
      ) : (
        <div className="flex flex-1 flex-col overflow-y-auto px-7 py-6 min-w-[300px]">
          <div className="grid">
            <div className="flex justify-between mb-7">
              <div className="flex space-x-2 justify-start items-center text-2xl text-white font-bold">
                <BrainIcon style={{ height: '1em' }} />
                <span>Brain region</span>
              </div>
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
            <Accordion.Root
              type="multiple"
              className="-ml-5 divide-y divide-primary-7"
              value={Object.keys(brainRegionsNavValue)}
              onValueChange={(newValue) => onValueChange(newValue, [])}
            >
              {brainRegions.map(({ colorCode, id, title, ...props }) => (
                <TreeNavItem
                  className="ml-5 divide-y divide-primary-6"
                  id={id}
                  key={id}
                  selectedId={brainRegionId}
                  value={brainRegionsNavValue[id]}
                  onValueChange={onValueChange}
                  path={[id]}
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
