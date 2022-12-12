import React from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import utils from '@/util/utils';
import ArrowDownOutlinedIcon from '@/components/icons/ArrowDownOutlined';
import styles from './tree-nav-item.module.css';

const { classNames } = utils;

export type TreeNavItemCallbackProps = { id: string };

export type TreeChildren = {
  id: string;
  title: string;
  items?: TreeChildren[];
};

type TreeNavItemProps = {
  className?: string;
  children?: React.ReactElement<TreeNavItemProps>;
  id?: any;
  items?: TreeChildren[];
  onValueChange?: ({ id }: TreeNavItemCallbackProps) => void;
  selectedId?: string;
  title?: string | React.ReactElement;
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
}: TreeNavItemProps) {
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
        <Accordion.Trigger
          className={classNames(
            styles.accordionTrigger,
            'flex gap-3 justify-end items-center text-left w-full'
          )}
          data-disabled={!items || items.length === 0}
        >
          {React.isValidElement(title) ? React.cloneElement(title) : title}
          {items && items.length > 0 && (
            <ArrowDownOutlinedIcon className={styles.accordionChevron} style={{ height: '13px' }} />
          )}
        </Accordion.Trigger>
      </Accordion.Header>
      {items && items.length > 0 && (
        <Accordion.Content>
          <Accordion.Root collapsible type="single">
            {items.map(({ id: itemId, items: nestedItems, title: itemTitle, ...itemProps }) =>
              React.isValidElement(children) ? (
                React.cloneElement(children as React.ReactElement<TreeNavItemProps>, {
                  className: classNames(className, children.props.className), // Child inherits parent classNames, merges new ones too
                  id: itemId,
                  items: nestedItems,
                  key: itemId,
                  onValueChange, // Pass-down the same callback.
                  selectedId,
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
