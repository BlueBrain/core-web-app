import React, { useMemo } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import utils from '@/util/utils';
import ArrowDownOutlinedIcon from '@/components/icons/ArrowDownOutlined';
import BrainRegionVisualizationTrigger, {
  Distribution,
} from '@/components/BrainRegionVisualizationTrigger';
import ColorBox from '@/components/ColorBox';
import styles from './tree-nav-item.module.css';

const { classNames } = utils;

export type TreeNavItemCallbackProps = { id: string };

export type TreeChildren = {
  id: string;
  title: string;
  items?: TreeChildren[];
  distribution?: Distribution;
  color_code: string;
};

type TreeNavItemProps = {
  className?: string;
  children?: React.ReactElement<TreeNavItemProps>;
  id?: any;
  items?: TreeChildren[];
  onValueChange?: ({ id }: TreeNavItemCallbackProps) => void;
  selectedId?: string;
  title?: string | React.ReactElement;
  distribution?: Distribution;
  colorCode?: string;
};

type TitleComponent = {
  title?: string;
};

export default function TreeNavItem({
  className = '',
  children,
  id,
  items,
  onValueChange,
  selectedId,
  title = '',
  distribution,
  colorCode,
}: TreeNavItemProps) {
  // renders the color box that is placed next to the region name
  const colorbox = useMemo(() => (colorCode ? <ColorBox color={colorCode} /> : null), [colorCode]);

  // renders the visualization trigger button.
  // If there is a distribution and color, renders the trigger. In any other case renders a disabled button
  const visualizationTrigger = useMemo(() => {
    if (distribution && colorCode) {
      return (
        <BrainRegionVisualizationTrigger
          regionID={id}
          distribution={distribution}
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
  }, [distribution, colorCode, id]);

  return (
    <Accordion.Item value={id} className={className}>
      <Accordion.Header
        className={classNames(
          styles.accordionHeader, // custom class for [data-state] conditional styling
          'flex items-center',
          selectedId === id ? 'is-active' : ''
        )}
        onClick={() => onValueChange && onValueChange({ id })} // Trigger the callback
      >
        {colorbox}
        <Accordion.Trigger
          className={classNames(
            styles.accordionTrigger,
            'flex gap-3 justify-end items-center text-left w-full'
          )}
          data-disabled={!items || items.length === 0}
        >
          {React.isValidElement(title) ? React.cloneElement(title) : title}
        </Accordion.Trigger>
        {visualizationTrigger}

        {items && items.length > 0 && (
          <ArrowDownOutlinedIcon className={styles.accordionChevron} style={{ height: '13px' }} />
        )}
      </Accordion.Header>
      {items && items.length > 0 && (
        <Accordion.Content>
          <Accordion.Root collapsible type="single">
            {items.map(
              ({
                id: itemId,
                items: nestedItems,
                title: itemTitle,
                distribution: itemDistribution,
                color_code: itemColorCode,
                ...itemProps
              }) =>
                React.isValidElement(children) ? (
                  React.cloneElement(children as React.ReactElement<TreeNavItemProps>, {
                    className: classNames(className, children.props.className), // Child inherits parent classNames, merges new ones too
                    id: itemId,
                    items: nestedItems,
                    key: itemId,
                    onValueChange, // Pass-down the same callback.
                    selectedId,
                    distribution: itemDistribution,
                    colorCode: itemColorCode,
                    title: React.isValidElement(children.props.title)
                      ? React.cloneElement(
                          children.props.title as React.ReactElement<TitleComponent>,
                          { title: itemTitle, ...itemProps }
                        )
                      : itemTitle,
                  })
                ) : (
                  <TreeNavItem
                    className={className} // Pass-down the same className definition
                    id={itemId}
                    items={nestedItems}
                    key={itemId}
                    onValueChange={onValueChange} // Pass-down the same callback
                    selectedId={selectedId}
                    distribution={itemDistribution}
                    colorCode={itemColorCode}
                    title={
                      React.isValidElement(title)
                        ? React.cloneElement(title as React.ReactElement<TitleComponent>, {
                            title: itemTitle,
                            ...itemProps,
                          })
                        : itemTitle
                    }
                  />
                )
            )}
          </Accordion.Root>
        </Accordion.Content>
      )}
    </Accordion.Item>
  );
}
