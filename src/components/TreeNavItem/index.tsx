import { ReactElement, ReactNode, ForwardedRef, forwardRef, useMemo } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { TreeItem } from 'performant-array-to-tree';
import { CaretRightOutlined } from '@ant-design/icons';
import { useAtomValue } from 'jotai';
import { classNames } from '@/util/utils';
import { sectionAtom } from '@/state/application';
import { NavValue } from '@/state/brain-regions/types';
import styles from './tree-nav-item.module.css';

type TreeNavItemProps = {
  className?: string;
  id: any;
  itemValue: NavValue;
  onValueChange: (newValue: string[], path: string[]) => void;
  path: string[];
  children: (
    ...args: any[]
  ) => ReactElement<{ children?: (...args: any[]) => ReactElement; isHidden?: boolean }>;
  items?: TreeItem[];
  colorCode?: string;
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
 * @param {NavValue} args.itemValue - A tree that reflects the expanded nav items.
 * @param {(newValue: string[], path: string[]) => void} args.onValueChange - A callback.
 * @param {string[]} args.path - Used for tracking the "current" nav depth level.
 */
export function TreeNavItem({
  children,
  className = 'ml-3',
  id,
  isExpanded,
  items,
  itemValue,
  onValueChange,
  path,
  colorCode,
  ...props
}: TreeNavItemProps) {
  const section = useAtomValue(sectionAtom);
  if (!section) {
    throw new Error('Section is not set');
  }

  const renderedItems = items?.map(({ id: itemId, items: nestedItems, ...itemProps }) => {
    // children may return another render-prop
    const childRender = children({
      id: itemId,
      isExpanded,
      itemValue,
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
        itemValue={itemValue?.[itemId] ?? null}
        isExpanded={typeof itemValue?.[itemId] !== 'undefined'}
        onValueChange={onValueChange}
        path={[...path, itemId]}
        colorCode={colorCode}
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

  const trigger = useMemo(
    () =>
      items?.length && renderedItems?.some((item) => item !== null) // Any non-hidden children?
        ? (triggerProps: {}) => (
            <Accordion.Trigger
              className={classNames(
                'accordion-trigger',
                styles.accordionTrigger,
                section ? styles[section] : ''
              )}
              data-disabled={!items || items.length === 0}
              {...triggerProps} /* eslint-disable-line react/jsx-props-no-spreading */
            >
              <CaretRightOutlined
                style={{ color: colorCode }}
                className={classNames(styles.accordionChevron, 'h-[13px] mix-blend-difference')}
              />
            </Accordion.Trigger>
          )
        : null,
    [items, renderedItems, section, colorCode]
  );

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
                value={itemValue ? Object.keys(itemValue) : []}
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
      itemValue,
      path,
      trigger,
      content,
      isExpanded,
      colorCode,
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
    colorCode,
  }: {
    children: (...args: any[]) => ReactElement<{ children?: (...args: any[]) => ReactElement }>;
    className?: string;
    items: TreeItem[];
    onValueChange: (newValue: string[], path: string[]) => void;
    value: NavValue;
    colorCode?: string;
  },
  ref?: ForwardedRef<HTMLDivElement>
) {
  return (
    <Accordion.Root
      className={classNames('relative -ml-4', className)}
      onValueChange={(newValue) => onValueChange(newValue, [])} // Empty path for root
      ref={ref}
      type="multiple"
      value={value ? Object.keys(value) : []}
    >
      {navItems.map(({ id, items, ...rest }) => (
        <TreeNavItem
          className={classNames('relative ml-4', className)}
          id={id}
          isExpanded={typeof value?.[id] !== 'undefined'}
          items={items}
          key={id}
          onValueChange={onValueChange}
          path={[id]}
          itemValue={value?.[id] ?? null}
          colorCode={colorCode}
          {...rest} // eslint-disable-line react/jsx-props-no-spreading
        >
          {children}
        </TreeNavItem>
      ))}
    </Accordion.Root>
  );
}

export default forwardRef(TreeNav);
