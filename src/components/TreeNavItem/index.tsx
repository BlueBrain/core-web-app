'use client';

import { ReactElement, ReactNode, ForwardedRef, forwardRef } from 'react';
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
  children: (
    ...args: any[]
  ) => ReactElement<{ children?: (...args: any[]) => ReactElement; isHidden?: boolean }>;
  items?: TreeItem[];
  // All other props - https://stackoverflow.com/questions/40032592/typescript-workaround-for-rest-props-in-react
  [x: string]: any;
};

/**
 * Renders a tree nav item using the render-prop pattern.
 * @param {Object} args
 * @param {(...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>
} args.children - The component that renders the markup for the nav item.
 * @param {string} args.className
 * @param {string} args.id
 * @param {boolean} args.isExpanded - Whether an item is expanded or collapsed.
 * @param {TreeItem[]} args.items - The nav items.
 * @param {NavValue} args.value - A tree that reflects the expanded nav items.
 * @param {(newValue: string[], path: string[]) => void} args.onValueChange - A callback.
 * @param {string[]} args.path - Used for tracking the "current" nav depth level.
 */
export function TreeNavItem({
  children,
  className = 'ml-3',
  id,
  isExpanded,
  items,
  value,
  onValueChange,
  path,
  ...props
}: TreeNavItemProps) {
  const trigger = items?.length
    ? (triggerProps: {}) => (
        <Accordion.Trigger
          className={styles.accordionTrigger}
          data-disabled={!items || items.length === 0}
          {...triggerProps} /* eslint-disable-line react/jsx-props-no-spreading */
        >
          <ArrowDownOutlinedIcon className={styles.accordionChevron} style={{ height: '13px' }} />
        </Accordion.Trigger>
      )
    : null;

  const renderedItems = items?.map(({ id: itemId, items: nestedItems, ...itemProps }) => {
    // children may return another render-prop
    const childRender = children({
      id: itemId,
      isExpanded,
      value,
      items: nestedItems,
      path,
      ...itemProps, // eslint-disable-line react/jsx-props-no-spreading
    });

    if (childRender?.props?.isHidden) {
      return null;
    }

    return nestedItems ? (
      <TreeNavItem
        key={itemId}
        id={itemId}
        items={nestedItems}
        className={className}
        value={value?.[itemId] ?? null}
        isExpanded={typeof value?.[itemId] !== 'undefined'}
        onValueChange={onValueChange}
        path={[...path, itemId]}
        {...props} // eslint-disable-line react/jsx-props-no-spreading
        {...itemProps} // eslint-disable-line react/jsx-props-no-spreading
      >
        {
          /* Pass-down the nested render-prop, if one exists. */
          childRender?.props?.children ?? children
        }
      </TreeNavItem>
    ) : (
      childRender
    );
  });

  const content =
    items?.length && renderedItems?.filter((item) => item)?.length
      ? (contentProps: { renderBefore?: ReactNode; renderAfter?: ReactNode } = {}) => {
          const { renderBefore, renderAfter, ...contentPropsRest } = contentProps;

          return (
            <Accordion.Content
              {...contentPropsRest} /* eslint-disable-line react/jsx-props-no-spreading */
            >
              {renderBefore}
              <Accordion.Root
                onValueChange={(newValue) => onValueChange(newValue, path)}
                type="multiple"
                value={value ? Object.keys(value) : []}
                asChild
              >
                <>
                  {/* eslint-disable-line react/jsx-no-useless-fragment */}
                  {renderedItems}
                </>
              </Accordion.Root>
              {renderAfter}
            </Accordion.Content>
          );
        }
      : null;

  const render =
    children &&
    children({
      items,
      id,
      value,
      path,
      trigger,
      content,
      ...props,
    });

  return !render.props.isHidden ? (
    <Accordion.Item value={id} className={className} data-tree-id={id}>
      <Accordion.Header asChild>
        {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
        <>{render}</>
      </Accordion.Header>
    </Accordion.Item>
  ) : null;
}

/**
 * Renders the title & content of a brain region nav item.
 * @param {Object} args
 * @param {string} args.className
 * @param {TreeItem[]} args.items - The nav items.
 * @param {(newValue: string[], path: string[]) => void} args.onValueChange - A callback.
 * @param {NavValue} args.value - For controlling the expansion and collapse of nav items.
 * @param {ForwardedRef} ref
 */
function TreeNav(
  {
    children,
    className,
    items: navItems,
    onValueChange,
    value,
  }: {
    children: (...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>;
    className?: string;
    items: TreeItem[];
    onValueChange: (newValue: string[], path: string[]) => void;
    value: NavValue;
  },
  ref?: ForwardedRef<HTMLDivElement>
) {
  return (
    <Accordion.Root
      className={classNames('-ml-3', className)}
      onValueChange={(newValue) => onValueChange(newValue, [])} // Empty path for root
      ref={ref}
      type="multiple"
      value={value ? Object.keys(value) : []}
    >
      {navItems.map(({ id, items, ...rest }) => (
        <TreeNavItem
          className={classNames('ml-3', className)}
          id={id}
          isExpanded={typeof value?.[id] !== 'undefined'}
          items={items}
          key={id}
          onValueChange={onValueChange}
          path={[id]}
          value={value?.[id] ?? null}
          {...rest} // eslint-disable-line react/jsx-props-no-spreading
        >
          {children}
        </TreeNavItem>
      ))}
    </Accordion.Root>
  );
}

export default forwardRef(TreeNav);
