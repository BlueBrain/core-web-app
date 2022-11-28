import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import utils from '@/util/utils';
import ArrowDownOutlinedIcon from '@/components/icons/ArrowDownOutlined';
import { Distribution } from '@/components/BrainRegionMeshTrigger';
import styles from './tree-nav-item.module.css';

const { classNames } = utils;

export type TreeNavItemCallbackProps = { id: string; distribution?: Distribution }; // Not all Brain Regions have a distribution

export type TreeChildren = {
  id: string;
  title: string;
  items?: TreeChildren[];
  distribution?: Distribution;
};

type TreeNavItemProps = {
  className?: string;
  children?: React.ReactElement<TreeNavItemProps>;
  distribution?: Distribution;
  id?: any;
  items?: TreeChildren[];
  onValueChange?: ({ id, distribution }: TreeNavItemCallbackProps) => void;
  selectedId?: string;
  title?: string | React.ReactElement;
};

type TitleComponent = {
  title?: string;
};

export default function TreeNavItem({
  className = '',
  children,
  distribution,
  id,
  items,
  onValueChange,
  selectedId,
  title = '',
}: TreeNavItemProps) {
  return (
    <Accordion.Item value={id} className={className}>
      <Accordion.Header
        className={classNames(
          styles.accordionHeader, // custom class for [data-state] conditional styling
          'flex items-center',
          selectedId === id ? 'is-active' : ''
        )}
        onClick={() => onValueChange && onValueChange({ id, distribution })} // Trigger the callback
      >
        <Accordion.Trigger
          className={classNames(
            styles.accordionTrigger,
            'w-full flex gap-3 justify-start items-center text-left'
          )}
          data-disabled={!items || items.length === 0}
        >
          {React.isValidElement(title) ? React.cloneElement(title) : title}
          {items && items.length > 0 && (
            <ArrowDownOutlinedIcon
              className={classNames(styles.accordionChevron, 'flex-none ml-auto')}
              style={{ height: '13px' }}
            />
          )}
        </Accordion.Trigger>
      </Accordion.Header>
      {items && items.length > 0 && (
        <Accordion.Content>
          <Accordion.Root collapsible type="single">
            {items.map(
              ({
                distribution: itemDistribution,
                id: itemId,
                items: nestedItems,
                title: itemTitle,
              }) =>
                React.isValidElement(children) ? (
                  React.cloneElement(children as React.ReactElement<TreeNavItemProps>, {
                    className: classNames(className, children.props.className), // Child inherits parent classNames, merges new ones too
                    distribution: itemDistribution,
                    id: itemId,
                    items: nestedItems,
                    key: itemId,
                    onValueChange, // Pass-down the same callback.
                    selectedId,
                    title: React.isValidElement(children.props.title)
                      ? React.cloneElement(
                          children.props.title as React.ReactElement<TitleComponent>,
                          { title: itemTitle }
                        )
                      : itemTitle,
                  })
                ) : (
                  <TreeNavItem
                    className={className} // Pass-down the same className definition
                    distribution={itemDistribution}
                    id={itemId}
                    items={nestedItems}
                    key={itemId}
                    onValueChange={onValueChange} // Pass-down the same callback
                    selectedId={selectedId}
                    title={
                      React.isValidElement(title)
                        ? React.cloneElement(title as React.ReactElement<TitleComponent>, {
                            title: itemTitle,
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
