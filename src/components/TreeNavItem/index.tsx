import { ReactElement } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { TreeItem } from 'performant-array-to-tree';
import ArrowDownOutlinedIcon from '@/components/icons/ArrowDownOutlined';
import { classNames } from '@/util/utils';
import styles from './tree-nav-item.module.css';

export type NavValue = { [key: string]: NavValue } | null;

type TreeNavItemProps = {
  className?: string;
  id: any;
  value: NavValue;
  onValueChange: (newValue: string[], path: string[]) => void;
  path: string[];
  children: (...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>;
  items?: TreeItem[];
  // All other props - https://stackoverflow.com/questions/40032592/typescript-workaround-for-rest-props-in-react
  [x: string]: any;
};

export function TreeNavItem({
  children,
  className = 'ml-5',
  id,
  items,
  value,
  onValueChange,
  path,
  ...props
}: TreeNavItemProps) {
  const header = (
    <Accordion.Header>
      {children &&
        children({
          id,
          ...props,
          trigger: items?.length ? (
            <Accordion.Trigger
              className={styles.accordionTrigger}
              data-disabled={!items || items.length === 0}
            >
              <ArrowDownOutlinedIcon
                className={styles.accordionChevron}
                style={{ height: '13px' }}
              />
            </Accordion.Trigger>
          ) : null,
        })}
    </Accordion.Header>
  );

  const content = (
    <Accordion.Content asChild>
      <Accordion.Root
        onValueChange={(newValue) => onValueChange(newValue, path)}
        type="multiple"
        value={value ? Object.keys(value) : []}
        asChild
      >
        <>
          {/* eslint-disable-line react/jsx-no-useless-fragment */}
          {items?.map(({ id: itemId, items: nestedItems, ...itemProps }) => {
            // children may return another render-prop
            const render = children({
              id: itemId,
              items: nestedItems,
              ...itemProps, // eslint-disable-line react/jsx-props-no-spreading
            });

            return nestedItems ? (
              <TreeNavItem
                key={itemId}
                id={itemId}
                items={nestedItems}
                className={className}
                value={value?.[itemId] ?? null}
                onValueChange={onValueChange}
                path={[...path, itemId]}
                {...props} // eslint-disable-line react/jsx-props-no-spreading
                {...itemProps} // eslint-disable-line react/jsx-props-no-spreading
              >
                {
                  /* Pass-down the nested render-prop, if one exists. */
                  render?.props?.children ?? children
                }
              </TreeNavItem>
            ) : (
              render
            );
          })}
        </>
      </Accordion.Root>
    </Accordion.Content>
  );

  return (
    <Accordion.Item value={id} className={className}>
      <>
        {header}
        {items && items.length > 0 && content}
      </>
    </Accordion.Item>
  );
}

export default function TreeNav({
  className,
  items: navItems,
  onValueChange,
  value,
  children,
}: {
  className: string;
  children: (...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>;
  items: TreeItem[];
  onValueChange: (newValue: string[], path: string[]) => void;
  value: NavValue;
}) {
  return (
    <Accordion.Root
      type="multiple"
      className={classNames('-ml-5', className)}
      value={value ? Object.keys(value) : []}
      onValueChange={(newValue) => onValueChange(newValue, [])} // Empty path for root
    >
      {navItems.map(({ id, items, ...rest }) => (
        <TreeNavItem
          id={id}
          items={items}
          key={id}
          className={classNames('ml-5', className)}
          path={[id]}
          value={value?.[id] ?? null}
          onValueChange={onValueChange}
          {...rest} // eslint-disable-line react/jsx-props-no-spreading
        >
          {children}
        </TreeNavItem>
      ))}
    </Accordion.Root>
  );
}
